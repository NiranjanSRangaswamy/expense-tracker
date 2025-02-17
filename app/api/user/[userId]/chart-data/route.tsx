import { headers } from "next/headers";
import { query } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { userId: number } }
) {
  const { userId } = params;
  const getQuery = "select * from records where userid = $1 group by category";
  const res = await query(getQuery, [userId]);
  return new Response(JSON.stringify({ data: userId }));
}
