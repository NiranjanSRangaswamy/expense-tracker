import { getClient } from "@/lib/db";
import { compare, hash } from "bcrypt";
import { verify, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PoolClient } from "pg";

interface ChangePasswordRequestData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export async function PUT(request: Request) {
  let client: PoolClient | null = null;

  try {
    const data: ChangePasswordRequestData = await request.json();
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
      if (!userId) throw new Error("Invalid token payload: User ID not found.")
    } catch (jwtError: any) {
      throw jwtError;
    }

    client = await getClient();
    await client.query("BEGIN");

    const result = await client.query("SELECT password FROM usertable WHERE id = $1",[userId]);

    if (result.rowCount === 0) throw new Error("User not found. Please re-authenticate.")

    const hashedPassword = result.rows[0].password;
    const isOldPasswordVerified = await compare(data.oldPassword,hashedPassword );

    if (!isOldPasswordVerified) throw new Error("Invalid old password provided.")

    const newHashedPassword = await hash(data.newPassword, 10);

    const updateResult = await client.query("UPDATE usertable SET password = $1 WHERE id = $2",[newHashedPassword, userId]);

    if (updateResult.rowCount === 0) throw new Error( "Failed to update password, user not found or no changes made.")

    await client.query("COMMIT");

    return NextResponse.json({ message: "Password changed successfully." },{ status: 200 });
    
  } catch (error: any) {
    console.error("Change password failed:", error);

    if (client) {
      await client.query("ROLLBACK");
    }

    let errorMessage = "An unexpected server error occurred.";
    let statusCode = 500;
    if (error.message === "Invalid old password provided.") {
      errorMessage = error.message;
      statusCode = 400;
    }
    return NextResponse.json({ message: errorMessage }, { status: statusCode });
  } finally {
    if (client) {
      client.release();
    }
  }
}
