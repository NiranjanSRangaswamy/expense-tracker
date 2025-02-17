import { ModeToggle } from "@/app/components/ModeToggle";
import React from "react";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import ToastComponent from "@/app/components/ToastComponent";
import { query } from "@/lib/db";

const page = async () => {
  let userDetails = undefined;
  try {
    const token = cookies().get("token");
    if (!token) throw new Error("token not present");
    const id = verify(token.value, process.env.JWT_SECRET as string);
    if (!id) throw new Error("Invaid token");

    try {
      const res = await query(
        "select id,firstname,darkmode,theme,balance,currency from usertable where id = $1",
        [id]
      );
      userDetails = res[0];
    } catch (error: any) {
      console.log(error.message);
    }
  } catch (error: any) {
    console.log(error.message);
    return (
      <ToastComponent
        toastData={{
          title: "Login Error",
          description: "Please Login again",
          variant: "destructive",
        }}
      />
    );
  }
  return (
    <section className=" statistics grow w-full md:h-screen overflow-hidden">
      <div className="w-11/12 md:w-full mx-auto md:h-full flex flex-col">
        <div className="flex justify-between md:w-11/12 mx-auto h-12 md:h-16 items-center">
          <h1 className="text-xl md:text-2xl">Statistics</h1>
          <div className="hidden md:inline-block md:py-2">
            <ModeToggle />
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
