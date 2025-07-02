import { getClient } from "@/lib/db"; 
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import { verify, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken"; 
import { PoolClient } from "pg";
import { query } from "@/lib/db";

interface BalanceUpdateRequestData {
  value: number; 
}

export async function POST(req: Request) {

  let client: PoolClient | null = null;
  let data: BalanceUpdateRequestData;
  let userId: string;


  const updateUserBalanceQuery = `UPDATE usertable SET balance = balance + $1 WHERE id = $2;`;
  const updateRecordsBalanceQuery = `UPDATE records SET balance = balance + $1 WHERE userid = $2;`;

  try {
    data = await req.json();
    if (typeof data.value !== "number" || isNaN(data.value)) {
      return NextResponse.json(
        { message: "Invalid or missing 'value' in request body." },
        { status: 400 } 
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token || !token.value) {
      return NextResponse.json(
        { message: "Authentication token missing. Please log in." },
        { status: 401 }
      );
    }

    userId = verify(token.value,process.env.JWT_SECRET as string) as string;
    if (userId) throw new Error("Invalid token payload: User ID not found.");

    client = await getClient();
    await client.query("BEGIN"); 

    const userUpdateResult = await client.query(updateUserBalanceQuery, [data.value,userId,]);
    if (userUpdateResult.rowCount === 0) throw new Error("User not found in usertable. Balance update failed.");

    await client.query(updateRecordsBalanceQuery, [data.value,userId,]);
    await client.query("COMMIT");

    return NextResponse.json(
      { message: "Balance updated successfully across user and records." }, { status: 200 }
    );

  } catch (error) {
    if (client) {
      await client.query("ROLLBACK"); 
    }
    return new Response(JSON.stringify({ message: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally{
    if(client) client.release()
  }
}
