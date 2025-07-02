import { getClient } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { PoolClient } from "pg";

interface RecordData {
  userId: number; // This will be ignored, as userId comes from the token
  transType: "income" | "expense";
  category: string;
  subCategory?: string;
  date: string;
  time: string;
  value: number;
  note?: string;
  payer?: string;
  balance?: number;
}

export async function POST(request: Request) {
  let data: RecordData;
  let client: PoolClient | null = null;

  const getPrevBalanceQuery = `
    SELECT balance FROM records 
    WHERE userid = $1 
      AND (dates, times) < ($2::date, $3::time) 
    ORDER BY dates DESC, times DESC 
    LIMIT 1
  `;

  const insertQuery = `
    INSERT INTO records 
    (userid, transtype, category, subcategory, dates, times, balance, value, note, payer) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING *;
  `;

  const updateLaterRecordsQuery = `
    UPDATE records 
    SET balance = balance + $4 
    WHERE userid = $1 
      AND (dates, times) > ($2::date, $3::time);
  `;

  const updateUserBalanceQuery = `
    UPDATE usertable 
    SET balance = $1 
    WHERE id = $2;
  `;

  const latestBalanceQuery = `
  SELECT balance FROM records 
  WHERE userid = $1 
  ORDER BY dates DESC, times DESC 
  LIMIT 1
`;

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

    userId = verify(token.value, process.env.JWT_SECRET as string) as string;
    if (!userId) throw new Error("Invalid token payload: User ID not found.");

    client = await getClient();
    await client.query("BEGIN");

    //Step 1 : Get the previous balance before the new Record
    const prevBalanceResult = await client.query(getPrevBalanceQuery, [
      userId,
      data.date,
      data.time,
    ]);

    const prevBalance = prevBalanceResult.rows.length > 0 ? prevBalanceResult.rows[0].balance : 0;

    // Step 2: Compute current balance for new record
    const adjustment = data.transType === "income" ? data.value : -data.value;
    const currentBalance = prevBalance + adjustment;

    // Step 3: Insert the new record
    await client.query(insertQuery, [
      userId,
      data.transType,
      data.category,
      data.subCategory,
      data.date,
      data.time,
      currentBalance,
      data.value,
      data.note,
      data.payer,
    ]);

    // Step 4: Update all future records in one go
    await client.query(updateLaterRecordsQuery, [
      userId,
      data.date,
      data.time,
      adjustment,
    ]);

    // Step 5: Update user's final balance
    const latestBalanceRes = await client.query(latestBalanceQuery, [userId,]);

    const finalBalance = latestBalanceRes.rows.length > 0 ? latestBalanceRes.rows[0].balance : 0;

    await client.query(updateUserBalanceQuery, [finalBalance, userId]);

    await client.query("COMMIT");

    return NextResponse.json(
      { message: "Record is added to the database successfully" },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if(client) await client.query("ROLLBACK");
    return NextResponse.json(
      { message: "Failed to add record" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    if(client) client.release();
  }
}
