"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Notebook,
  UserCog,
  ChartNoAxesCombined,
} from "lucide-react";
import { Logout } from "./Logout";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";

const AsideNav = ({ userData }: { userData: UserDetails }) => {
  const userId: number = userData.id;
  const pathName = usePathname();
  return (
    <div className="h-full min-h-screen w-72 flex-shrink flex flex-col py-5 gap-2">
      <Card className="h-32 w-11/12 mx-auto flex flex-col justify-center items-center">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback className="capitalize bg-background">
            {userData.firstname.slice(0, 1).toUpperCase()}
            {userData.lastname.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="capitalize">{userData.firstname}</h1>
        <Separator />
      </Card>

      <Card className="grow w-11/12 mx-auto bg-card">
        <Link href={`/user/${userData.id}/dashboard`} className="w-full ">
          <Button
            variant={"nav"}
            className={`capitalize w-full flex-start text-md h-16 ${
              pathName === `/user/${userId}/dashboard`
                ? "text-primary font-semibold "
                : ""
            }`}
          >
            <LayoutDashboard className="mr-3" /> Dashboard
          </Button>
        </Link>
        
        <Link href={`/user/${userData.id}/statistics`} className="w-full ">
          <Button
            variant={"nav"}
            className={`capitalize w-full flex-start text-md h-16 ${
              pathName === `/user/${userId}/statistics`
                ? "text-primary font-semibold "
                : ""
            }`}
          >
            <ChartNoAxesCombined className="mr-3" /> Statistics
          </Button>
        </Link>

        <Link href={`/user/${userData.id}/records`} className="w-full ">
          <Button
            variant={"nav"}
            className={`capitalize w-full flex-start text-md h-16 ${
              pathName === `/user/${userId}/records`
                ? "text-primary font-semibold "
                : ""
            }`}
          >
            <Notebook className="mr-3" /> Records
          </Button>
        </Link>

        <Link href={`/user/${userData.id}/settings`} className="w-full ">
          <Button
            variant={"nav"}
            className={`capitalize w-full flex-start text-md h-16 ${
              pathName === `/user/${userId}/settings`
                ? "text-primary font-semibold "
                : ""
            }`}
          >
            <UserCog className="mr-3" /> Settings
          </Button>
        </Link>
      </Card>
      <Card className="w-11/12 mx-auto  bg-card">
        <Separator />
        <Logout variant={"ghost"} size={24} classes="text-md w-full h-16" />
      </Card>
    </div>
  );
};

export default AsideNav;
