import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return NextResponse.json({ message: "logged out successfully" },{ status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Logout failed" },{status: 400,});
  }
}
