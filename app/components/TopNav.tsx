import { Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  LayoutDashboard,
  Notebook,
  UserCog,
  ChartNoAxesCombined,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logout } from "./Logout";
import { ModeToggle } from "./ModeToggle";



const TopNav = ({ userData }: { userData: UserDetails }) => {
  const userId: number = userData.id;
  return (
    <>
      <div className="w-11/12 mx-auto flex justify-between h-16 items-center ">
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent side={"left"} className="w-72 flex flex-col h-screen">
            <SheetHeader>
              <SheetTitle className="flex justify-center">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="capitalize">
                    {userData.firstname.slice(0, 1).toUpperCase()}
                    {userData.lastname.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </SheetTitle>
              <SheetDescription className="capitalize">
                {userData.firstname}
              </SheetDescription>
            </SheetHeader>
            <Separator />
            <div className="flex flex-col justify-start items-start grow">
              <SheetClose asChild>
                <Link href={`/user/${userId}/dashboard`} className="w-full ">
                  <Button
                    variant={"ghost"}
                    className="capitalize w-full text-left  text-md h-16"
                  >
                    <LayoutDashboard className="mr-3" /> Dashboard
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={`/user/${userId}/statistics`} className="w-full ">
                  <Button
                    variant={"ghost"}
                    className="capitalize w-full text-left text-md  h-16"
                  >
                    <ChartNoAxesCombined className="mr-3" /> Statistics
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={`/user/${userId}/records`} className="w-full ">
                  <Button
                    variant={"ghost"}
                    className="capitalize w-full text-left  text-md h-16"
                  >
                    <Notebook className="mr-3" /> Records
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={`/user/${userId}/settings`} className="w-full ">
                  <Button
                    variant={"ghost"}
                    className="capitalize w-full text-left text-md h-16"
                  >
                    <UserCog className="mr-3" /> Settings
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href={`/`} className="w-full ">
                  <Button
                    variant={"ghost"}
                    className="capitalize w-full text-left text-md h-16"
                  >
                    <UserCog className="mr-3" /> Home
                  </Button>
                </Link>
              </SheetClose>
            </div>
            <Separator />
            <SheetClose asChild>
              <SheetFooter>
                <Logout
                  variant={"ghost"}
                  size={24}
                  classes="text-md w-full h-16"
                />
              </SheetFooter>
            </SheetClose>
          </SheetContent>
        </Sheet>
        <h1>Expense tracker</h1>
        <ModeToggle />
      </div>
      <Separator />
    </>
  );
};

export default TopNav;
