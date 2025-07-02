import { query } from "@/lib/db";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token");
  if (!token) {
    return NextResponse.json({ message: "Login error" }, {status: 401, });
  }
  let { budget } = await request.json();
  let updateQuery = "update usertable set budget = $1 where id = $2";
  try {
    const id = verify(token?.value as string, process.env.JWT_SECRET as string);
    query(updateQuery, [budget, id]);
    return NextResponse.json({ message: "budget set successfully" }, { status: 201 } );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ message: "database error" }, {status: 500, });
  }
}
