import { query } from "@/lib/db";
import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

interface queryType {
  id: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const res: queryType[] = await query("select id,email, password from usertable where email = $1",[data.email]);
    if (res.length === 0) {
      return new Response(JSON.stringify({ message: "Invalid Email" }), {
        status: 401,
      });
    }
    const verified = await bcrypt.compare(data.password, res[0].password);
    if (verified) {
      const token = sign(res[0].id as string, process.env.JWT_SECRET as string);
      return NextResponse.json({ message: "Login successful", userID: res[0].id },
        {
          headers: {
            "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600`,
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      return NextResponse.json({ message: "Invalid Password" },{status: 401,})
    }
  } catch (error: any) {
    return NextResponse.json({ message: "An Error Occured, please try again" },{ status: 500 });
  }
}
