import { getClient } from "@/lib/db";
import { verify, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PoolClient } from "pg";

interface GetRecord {
  transtype: "income" | "expense";
  value: number;
  dates: string; 
  times: string;
  transid: number;
}

export async function DELETE(
  request: Request,
  { params }: { params: { transid: string } }
) {
  const { transid } = await params; 
  let client: PoolClient | null = null; 

  try {
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
      userId = verify(
        token.value,
        process.env.JWT_SECRET as string
      ) as string;
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

    
    const getRecordRes: { rows: GetRecord[]; rowCount: number | null } =
      await client.query(
        `SELECT transtype, value, dates, times, transid
         FROM records
         WHERE transid = $1::bigint AND userid = $2`, 
        [transid, userId]
      );

    if (!getRecordRes.rowCount) {
      throw new Error("Record not found or does not belong to this user.");
    }

    const record = getRecordRes.rows[0];
    const adjustment =
      record.transtype === "income" ? -record.value : record.value;

    await client.query(
      `UPDATE records
       SET balance = balance + $1
       WHERE userid = $2
         AND (
           dates > $3::date -- Later dates than deleted record's date
           OR (dates = $3::date AND times > $4::time) -- Same date, later times than deleted record's time
           OR (dates = $3::date AND times = $4::time AND transid > $5::bigint) -- Same date & time, later transid than deleted record's transid
         );`,
      [adjustment, userId, record.dates, record.times, record.transid] 
    );

    await client.query(
      `DELETE FROM records
       WHERE transid = $1::bigint AND userid = $2`, 
      [transid, userId]
    );

    await client.query(
      `UPDATE usertable
       SET balance = balance + $1
       WHERE id = $2`,
      [adjustment, userId]
    );

    await client.query("COMMIT"); 

    return  NextResponse.json({ message: "Record deleted successfully", transid },{ status: 200 }) ;

    } catch (error:any) {
    console.log(error.message)
    if (client) {
      console.error("Transaction rolled back due to error:", error);
      await client.query("ROLLBACK");
    }
    return NextResponse.json(
      { message: "Failed to delete record", error: (error as Error).message },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release(); 
    }
  }
}
