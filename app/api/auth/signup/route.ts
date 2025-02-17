import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

const saltRounds = 10;

export async function POST(request: Request) {
  const { firstName, lastName, email, password } = await request.json();
  const insertQuery = `INSERT INTO usertable (firstName, lastname, email, password, balance) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
  const selectQuery = "SELECT EMAIL FROM usertable WHERE EMAIL = $1";
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    const res = await query(selectQuery, [email]);
    if (res.length) {
      return new Response(
        JSON.stringify({ message: "Email is already registered" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const newUser = await query(insertQuery, [
      firstName,
      lastName,
      email,
      hashedPassword,
      0,
    ]);
    const id = newUser[0].id;
    const token = sign(
      { userId: newUser[0].id, email: newUser[0].email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    return new Response(
      JSON.stringify({ message: "Sign up successfull", id }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-age=3600;`,
          "Content-Type": "applicaton/json",
        },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ message: "Internal Error" }), {
      status: 500,
    });
  }
}
