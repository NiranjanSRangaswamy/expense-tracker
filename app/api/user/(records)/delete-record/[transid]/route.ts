import { getClient } from "@/lib/db";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface GetRecord {
  transtype: "income" | "expense";
  value: number;
  dates: Date;
  times: string;
}

export async function DELETE(request: Request,
  { params }: { params: { transid: string } }
) {
  const { transid } = params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const client = await getClient();
  try {
    const userid = verify(
      token?.value as string,
      process.env.JWT_SECRET as string
    );
    if (!userid) throw new Error("User Verification failed");

    await client.query("BEGIN");

    //getting record details
    const getRecordRes: { rows: GetRecord[]; rowCount: number | null } =
      await client.query(
        `SELECt transtype, value, dates, times
        FROM records
        WHERE transid =$1 AND userid = $2 `,
        [transid, userid]
      );

    if (!getRecordRes.rowCount) throw new Error("Record not found");

    const record = getRecordRes.rows[0];
    const adjustment =
      record.transtype === "income" ? -record.value : record.value;

    //reversing the effect of the record
    await client.query(
      `UPDATE records
      SET balance = balance +$1
      WHERE userid = $2 AND (dates, times) > ($3::date, $4::time)`,
      [adjustment, userid, record.dates, record.times]
    );

    // deleting the record
    await client.query(
      `DELETE FROM records 
      WHERE transid =$1 AND userid = $2`,
      [transid, userid]
    );

    // updating balance in the usertable
    await client.query(
      `UPDATE usertable
      SET balance = balance+$1
      WHERE id = $2`,
      [adjustment, userid]
    );

    await client.query("COMMIT");

    return NextResponse.json({ transid }), { status: 200 };
  } catch (err: any) {
     await client.query("ROLLBACK");
    return NextResponse.json({ message: err.message }, {status: 400, });
  } finally {
    client.release();
  }
}
