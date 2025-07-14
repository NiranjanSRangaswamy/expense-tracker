"use client";
import {
  LogOut,
  CircleUser,
  LayoutDashboard,
  Notebook,
  UserCog,
  ChartNoAxesCombined,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { JwtPayload } from "jsonwebtoken";

export function ProfileImage({ userId }: { userId: string | JwtPayload }) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogOut = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.refresh();
    } catch (error: any) {
      let errorMessage = error.message;
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data.message;
      }
      toast({
        duration: 3000,
        variant: "destructive",
        description: errorMessage,
      });
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="bg-card">
          <AvatarImage src="" />
          <AvatarFallback>
            <CircleUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" bg-card">
        <DropdownMenuLabel className="w-full text-center">
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/user/${userId}/dashboard`} className="w-full ">
            <Button variant={"ghost"} className="capitalize w-full text-left  ">
              <LayoutDashboard className="mr-3" size={16} /> Dashboard
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/user/${userId}/statistics`} className="w-full ">
            <Button variant={"ghost"} className="capitalize w-full text-left  ">
              <ChartNoAxesCombined className="mr-3" size={16} /> Statistics
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/user/${userId}/records`} className="w-full flex ">
            <Button variant={"ghost"} className="capitalize w-full text-left  ">
              <Notebook className="mr-3" size={16} /> Records
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/user/${userId}/settings`} className="w-full ">
            <Button variant={"ghost"} className="capitalize w-full text-left ">
              <UserCog className="mr-3" size={16} /> Settings
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogOut}>
          <Button variant={"ghost"} className=" w-full text-left ">
            <LogOut size={16} className="mr-3" />
            <span>Log out</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
