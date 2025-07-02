import React from "react";
import { ModeToggle } from "./ModeToggle";
import { LoginCard } from "./LoginCard";
import { JwtPayload, verify } from "jsonwebtoken";

import { ProfileImage } from "./ProfileImage";
import { Separator } from "@/components/ui/separator";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const Navbar = async () => {
  const cookieStore =await cookies()
  const token = cookieStore.get('token')
  let userId: JwtPayload | string = "";
  if (token?.value) {
    userId = verify(token?.value as string, process.env.JWT_SECRET as string);
  }

  return (
    <section className="nav top-0 sticky left-0 w-full  bg-background z-10">
      <nav className="nav flex justify-between items-center h-16 w-4/5 mx-auto">
        <div>
          <strong>Expense Tracker</strong>
        </div>
        <div className="flex gap-2 items-center h-16 flex-row md:flex-row ">
          <ModeToggle />
          {userId ? <ProfileImage userId={userId} /> : <LoginCard />}
        </div>
      </nav>
      <Separator />
    </section>
  );
};

export default Navbar;
