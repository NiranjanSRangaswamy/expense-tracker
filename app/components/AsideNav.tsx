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

interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  darkmode: string | null;
  theme: string | null;
}

const AsideNav = ({ userData }: { userData: UserData }) => {
  const userId: number = userData.id;
  return (
    <div className="h-full min-h-screen  bg-card w-72 flex-shrink flex flex-col ">
      <div className="h-32 w-11/12 mx-auto flex flex-col justify-center items-center">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback className="capitalize">
            {userData.firstname.slice(0, 1).toUpperCase()}
            {userData.lastname.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="capitalize">{userData.firstname}</h1>
        <Separator />
      </div>

      <div className="grow w-11/12 mx-auto">
        <Link href={`/user/${userData.id}/dashboard`} className="w-full ">
          <Button
            variant={"ghost"}
            className="capitalize w-full flex-start  text-md h-16"
          >
            <LayoutDashboard className="mr-3" /> Dashboard
          </Button>
        </Link>
        <Link href={`/user/${userData.id}/statistics`} className="w-full ">
          <Button
            variant={"ghost"}
            className="capitalize w-full flex flex-start text-md h-16"
          >
            <ChartNoAxesCombined className="mr-3" /> Statistics
          </Button>
        </Link>
        <Link href={`/user/${userData.id}/records`} className="w-full ">
          <Button
            variant={"ghost"}
            className="capitalize w-full text-left  text-md h-16"
          >
            <Notebook className="mr-3" /> Records
          </Button>
        </Link>
        <Link href={`/user/${userData.id}/settings`} className="w-full ">
          <Button
            variant={"ghost"}
            className="capitalize w-full text-left text-md h-16"
          >
            <UserCog className="mr-3" /> Settings
          </Button>
        </Link>
      </div>
      <div className="w-11/12 mx-auto my-2">
        <Separator />
        <Logout variant={"ghost"} size={24} classes="text-md w-full h-16" />
      </div>
    </div>
  );
};

export default AsideNav;
