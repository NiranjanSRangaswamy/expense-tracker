import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*"],
};
