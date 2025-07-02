import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { getClient, query } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies,} from "next/headers";
import { PoolClient } from "pg";

interface EditData{
  firstName: string, 
  lastName: string,
  email:string,
}

export async function PUT(request: Request) {
  console.log('request recieved')
  const data:EditData = await request.json()
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  const client =await getClient()
  try {
    const id = verify(token?.value as string, process.env.JWT_SECRET as string)
    await client.query('BEGIN')
    const isDuplicate = await client.query('select email from usertable where email =$1 AND id !=$2',[data.email,id])
    if(isDuplicate.rowCount) throw new Error('Email already registered')
    const res = await client.query(
      "UPDATE usertable SET firstname = $1, lastname = $2, email = $3 WHERE id = $4 RETURNING *",
      [data.firstName, data.lastName, data.email, id]
    );    
    console.log(res.rowCount)
    if(!res.rowCount) throw new Error('User not found')
    await client.query('COMMIT')
    return new NextResponse(JSON.stringify({message: 'Data modified successfully'}),{status: 200})
  } catch (error:any) {
    await client.query('ROLLBACK')
    return new NextResponse(JSON.stringify({message: error.message}),{status: 400})
  } finally{
    client.release()
  }
}

export async function DELETE(request: Request) {
  let client: PoolClient | null = null;

  try {

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
      userId = verify(token.value, process.env.JWT_SECRET as string) as string;
      if (!userId) {
        throw new Error("Invalid token payload: User ID not found.");
      }
    } catch (jwtError: any) {
      throw jwtError;
    }

    client = await getClient();
    await client.query("BEGIN"); 

    const recordsDeleteResult = await client.query(
      "DELETE FROM records WHERE userid = $1",
      [userId]
    );

    const userDeleteResult = await client.query(
      "DELETE FROM usertable WHERE id = $1",
      [userId]
    );

    if (userDeleteResult.rowCount === 0) {
      throw new Error("User account not found or already deleted.");
    }

    await client.query("COMMIT"); 


    cookieStore.delete("token");

    return NextResponse.json(
      { message: "User account and associated data deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    if (client) {
      await client.query("ROLLBACK");
    }

    let errorMessage = "An unexpected server error occurred.";
    let statusCode = 500;

    if (error instanceof TokenExpiredError) {
      errorMessage = "Authentication token has expired. Please log in again.";
      statusCode = 401; 
    } else if (error instanceof JsonWebTokenError) {
      errorMessage = "Invalid authentication token. Please log in again.";
      statusCode = 401; 
    } else if (error.message === "User account not found or already deleted.") {
      errorMessage = error.message; 
      statusCode = 404; 
    } else if (error.message === "Invalid token payload: User ID not found.") {
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