import React from "react";
import { ModeToggle } from "./ModeToggle";
import { LoginCard } from "./LoginCard";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ProfileImage } from "./ProfileImage";
import { Separator } from "@/components/ui/separator";

const Navbar = ({ userId }: { userId: undefined | string | JwtPayload }) => {
  return (
    <section className="nav top-0 sticky left-0 w-full  bg-background">
      <nav className="nav flex justify-between items-center h-16 w-4/5 mx-auto">
        <div>
          <strong>Expense Tracker</strong>
        </div>
        <div className="flex gap-2 items-center h-16 flex-row md:flex-row">
          <ModeToggle />
          {userId ? <ProfileImage userId={userId} /> : <LoginCard />}
        </div>
      </nav>
      <Separator />
    </section>
  );
};

export default Navbar;
