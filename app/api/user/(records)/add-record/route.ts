import { getClient } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { PoolClient } from "pg";

interface RecordData {
  userId: number; 
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
    SELECT balance
    FROM records
    WHERE userid = $1
      AND (
        dates < $2::date -- Records on earlier dates
        OR (dates = $2::date AND times < $3::time)
        OR (
            dates = $2::date AND times = $3::time AND transid < (
                SELECT COALESCE(MAX(transid), 0) + 1 
                FROM records
                WHERE userid = $1 AND dates = $2::date AND times = $3::time
            )
        )
      )
    ORDER BY dates DESC, times DESC, transid DESC
    LIMIT 1;
  `;

  const insertQuery = `
    INSERT INTO records
    (userid, transtype, category, subcategory, dates, times, balance, value, note, payer)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING transid;
  `;


  const updateLaterRecordsQuery = `
    UPDATE records
    SET balance = balance + $5
    WHERE userid = $1
      AND (
        dates > $2::date 
        OR (dates = $2::date AND times > $3::time)
        OR (dates = $2::date AND times = $3::time AND transid > $4::bigint)
      );
  `;

  const updateUserBalanceQuery = `
    UPDATE usertable
    SET balance = $1
    WHERE id = $2;
  `;

  const latestBalanceQuery = `
  SELECT balance
  FROM records
  WHERE userid = $1
  ORDER BY dates DESC, times DESC, transid DESC
  LIMIT 1;
  `;
  
  try {
    data = await request.json();
    
    const cookieStore =await cookies();
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

    const prevBalanceResult = await client.query(getPrevBalanceQuery, [
      userId,
      data.date,
      data.time,
    ]);

    const prevBalance =
      prevBalanceResult.rows.length > 0 ? prevBalanceResult.rows[0].balance : 0;

    const adjustment = data.transType === "income" ? data.value : -data.value;
    const currentBalance = prevBalance + adjustment;

    const insertResult = await client.query(insertQuery, [
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

    const newTransid = insertResult.rows[0].transid; 

    await client.query(updateLaterRecordsQuery, [
      userId,
      data.date,
      data.time,
      newTransid,
      adjustment, 
    ]);

    const latestBalanceRes = await client.query(latestBalanceQuery, [userId]);
    const finalBalance =
      latestBalanceRes.rows.length > 0 ? latestBalanceRes.rows[0].balance : 0;

    await client.query(updateUserBalanceQuery, [finalBalance, userId]);

    await client.query("COMMIT"); 

    return NextResponse.json(
      { message: "Record is added to the database successfully" },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (client) {
      console.error("Transaction rolled back due to error:", error);
      await client.query("ROLLBACK"); // Rollback transaction on error
    }
    return NextResponse.json(
      { message: "Failed to add record", error: (error as Error).message }, // Include error message for debugging
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    if (client) {
      client.release(); // Release client back to the pool
    }
  }
}
