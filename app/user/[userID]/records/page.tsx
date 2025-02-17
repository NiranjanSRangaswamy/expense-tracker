import { ModeToggle } from "@/app/components/ModeToggle";
import { query } from "@/lib/db";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import React from "react";

const page = async () => {
  try {
    const token = cookies().get("token");
    if (!token) throw new Error("Token not found");
    const id = verify(token.value, process.env.JWT_SECRET as string);
    if (!id) throw new Error("Invalid Token");
    try {
      const records = await query("select * from records where ");
    } catch (error: any) {
      console.log(error.message);
    }
  } catch (error: any) {
    console.log(error.message);
  }
  const token = cookies().get("token");
  return (
    <section className=" statistics grow w-full md:h-screen overflow-hidden">
      <div className="w-11/12 md:w-full mx-auto md:h-full flex flex-col">
        <div className="flex justify-between md:w-11/12 mx-auto h-12 md:h-16 items-center">
          <h1 className="text-xl md:text-2xl">Records</h1>
          <div className="hidden md:inline-block md:py-2">
            <ModeToggle />
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
