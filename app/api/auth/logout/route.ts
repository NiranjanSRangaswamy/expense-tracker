import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    cookies().delete("token");
    return new Response(
      JSON.stringify({ message: "logged out successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Logout failed" }), {
      status: 400,
    });
  }
}
