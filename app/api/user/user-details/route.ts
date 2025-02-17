import { verify } from "jsonwebtoken";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  const selectQuery = "SELECT * FROM usertable WHERE id = $1";
  const authheaders = request.headers.get("Authorization");
  const token = authheaders?.slice(7);
  if (!token) {
    return new Response(
      JSON.stringify({ message: "Login error. Please login again" }),
      { status: 401 }
    );
  }
  try {
    const verified = verify(token, process.env.JWT_SECRET as string);
    const res = await query(selectQuery, [verified]);
    const data = res[0];
    delete data.password;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal Error" }), {
      status: 500,
    });
  }
}
