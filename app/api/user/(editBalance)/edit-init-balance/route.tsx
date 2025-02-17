import { cookies } from "next/headers";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  const editQuery = [
    "update usertable set balance = balance + $1 where id = $2",
    "update records set balance = balance + $1 where userid=$2",
  ];
  try {
    const data = await req.json();
    const { userId } = data;
    await query(editQuery[0], [String(data.value), userId]);
    try {
      await query(editQuery[1], [data.value, userId]);
    } catch (error) {
      await query(editQuery[0], [0 - data.value, userId]);
      return new Response(JSON.stringify({ message: "database Error" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ data: "success" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
