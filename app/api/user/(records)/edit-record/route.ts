import { getClient } from "@/lib/db";
import { verify, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PoolClient } from "pg";

interface RecordFormData {
  transid: number;
  transType: "income" | "expense";
  category: string;
  subCategory?: string;
  date: string;
  time: string;
  value: number;
  note?: string;
  payer?: string;
}

interface OldRecord {
  value: number;
  transtype: "income" | "expense";
  dates: string;
  times: string;
  transid: number;
}

export async function PUT(request: Request) {
  let data: RecordFormData;
  let client: PoolClient | null = null;

  try {
    data = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token || !token.value) {
      return NextResponse.json(
        { message: "Authentication token missing. Please log in." },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      userId = verify(token.value, process.env.JWT_SECRET as string) as string;
      if (!userId) {
        throw new Error("Invalid token payload: User ID not found.");
      }
    } catch (jwtError) {
      if (jwtError instanceof TokenExpiredError) {
        return NextResponse.json(
          { message: "Authentication token expired. Please log in again." },
          { status: 401 }
        );
      } else if (jwtError instanceof JsonWebTokenError) {
        return NextResponse.json(
          { message: "Invalid authentication token. Please log in again." },
          { status: 401 }
        );
      }
      throw jwtError;
    }

    client = await getClient();
    await client.query("BEGIN");

    //getting the original record before the edit
    const oldRecordRes: { rows: OldRecord[]; rowCount: number | null } =
      await client.query(
        `SELECT value, transtype, dates, times, transid FROM records WHERE transid = $1 AND userid = $2`,
        [data.transid, userId]
      );

    if (!oldRecordRes.rowCount) {
      throw new Error(
        "Original record not found or does not belong to this user."
      );
    }

    const oldRecord = oldRecordRes.rows[0];

    const oldAdjustment = oldRecord.transtype === "income" ? -oldRecord.value : oldRecord.value;

    //getting the balance before updating record, this is required since users can edit date and time
    const getPrevBalanceForNewPositionQuery = `
      SELECT balance
      FROM records
      WHERE userid = $1
        AND transid != $4::bigint
        AND (
          dates < $2::date 
          OR (dates = $2::date AND times < $3::time) 
          OR (dates = $2::date AND times = $3::time AND transid < $4::bigint) 
        )
      ORDER BY dates DESC, times DESC, transid DESC
      LIMIT 1;
    `;

    const prevBalanceRes = await client.query(
      getPrevBalanceForNewPositionQuery,
      [userId, data.date, data.time, data.transid]
    );

    // reversing the effect of the current record to the later records
    await client.query(
      `UPDATE records
       SET balance = balance + $4
       WHERE userid = $1
         AND (
           dates > $2::date
           OR (dates = $2::date AND times > $3::time) 
           OR (dates = $2::date AND times = $3::time AND transid > $5::bigint) 
         );`,
      [
        userId,
        oldRecord.dates,
        oldRecord.times,
        oldAdjustment,
        oldRecord.transid,
      ]
    );

    const prevBalance =
      prevBalanceRes.rows.length > 0 ? prevBalanceRes.rows[0].balance : 0;

    // updating the current record
    const currentAdjustment =
      data.transType === "income" ? data.value : -data.value;
    const currentBalance = prevBalance + currentAdjustment;

    await client.query(
      `UPDATE records
       SET transtype = $1, value = $2, category = $3, subcategory = $4, note = $5, payer = $6, dates = $7, times = $8, balance = $9
       WHERE transid = $10 AND userid = $11`,
      [
        data.transType,
        data.value,
        data.category,
        data.subCategory,
        data.note,
        data.payer,
        data.date,
        data.time,
        currentBalance,
        data.transid,
        userId,
      ]
    );

    // updating the later records
    const updateLaterRecordsAfterNewPositionQuery = `
      UPDATE records
      SET balance = balance + $5
      WHERE userid = $1
        AND (
          dates > $2::date 
          OR (dates = $2::date AND times > $3::time) 
          OR (dates = $2::date AND times = $3::time AND transid > $4::bigint) 
        );
    `;
    await client.query(updateLaterRecordsAfterNewPositionQuery, [
      userId,
      data.date,
      data.time,
      data.transid,
      currentAdjustment,
    ]);

    // updating the final balance in the user table
    const finalAdjustment = currentAdjustment + oldAdjustment;
    await client.query(
      `UPDATE usertable
       SET balance = balance + $1
       WHERE id = $2`,
      [finalAdjustment, userId]
    );

    await client.query("COMMIT");

    return NextResponse.json(
      { message: "Record updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (client) {
      console.error("Transaction rolled back due to error:", error);
      await client.query("ROLLBACK");
    }
    return NextResponse.json(
      { message: "Failed to update record", error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}
