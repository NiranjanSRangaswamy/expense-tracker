import { getClient } from "@/lib/db";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface OldRecord {
  value: number;
  transtype: "income" | "expense";
  dates: Date;
  times: string;
}

export async function PUT(request: Request) {
  const data: RecordFormData = await request.json();
  const client = await getClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  try {
    const userId = Number(
      verify(token?.value as string, process.env.JWT_SECRET as string)
    );
    await client.query("BEGIN");

    //getting old record
    const oldRecordRes: { rows: OldRecord[]; rowCount: number | null } =
      await client.query(
        `SELECT value, transtype, dates, times FROM records WHERE transid = $1 AND userid = $2`,
        [data.transid, userId]
      );
    if (!oldRecordRes.rowCount) throw new Error("Original record not found");
    const oldRecord = oldRecordRes.rows[0];

    const oldAdjustment =
      oldRecord.transtype === "income" ? -oldRecord.value : oldRecord.value;

    //reverting the effect of the records that is being modified
    await client.query(
      `UPDATE records
       SET balance = balance + $4
       WHERE userid = $1 AND (dates, times) > ($2::date, $3::time)`,
      [userId, oldRecord.dates, oldRecord.times, oldAdjustment]
    );

    //getting the last balance before the new Record
    const prevBalanceRes =await client.query(
    `SELECT balance FROM records 
     WHERE userid = $1 AND (dates, times) < ($2::date, $3::time) 
     ORDER BY dates DESC, times DESC 
     LIMIT 1`,
     [data.userId,data.date, data.time]
    )
    const prevBalance = prevBalanceRes.rowCount ? prevBalanceRes.rows[0].balance : 0;
    const currentAdjustment =  data.transType === "income" ? data.value : -data.value;
    const currentBalance = prevBalance + currentAdjustment

    // modifying the record
    await client.query(
      `UPDATE records 
       SET transtype = $1, value = $2, category = $3, subcategory = $4,note = $5, payer = $6, dates = $7, times = $8, balance = $9
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

    // modifying the balance for the later records
    await client.query(`
    UPDATE records 
    SET balance = balance + $4 
    WHERE userid = $1 
      AND (dates, times) > ($2::date, $3::time);
  `,[userId, data.date, data.time,currentAdjustment]);

    const finalAdujstment  = oldAdjustment + currentAdjustment ;
    
    // modifying the usertable record to update the current balance
    await client.query(
    `UPDATE usertable
     SET balance = balance+$1 
     Where id = $2 `,[finalAdujstment, userId])

    await client.query("COMMIT");
    console.log('return')

    return new NextResponse(JSON.stringify({ message: "Success" }), {
      status: 200,
    });

  } catch (error: any) {
    await client.query("ROLLBACK");
    return new NextResponse(JSON.stringify({ message: error.message }), {
      status: 401,
    });
  } finally {
    client.release();
  }
}
