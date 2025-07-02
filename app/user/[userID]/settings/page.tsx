import ChangePassword from "@/app/components/ChangePassword";
import DeleteAccount from "@/app/components/DeleteAccount";
import { ModeToggle } from "@/app/components/ModeToggle";
import UserInfo from "@/app/components/UserInfo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { query } from "@/lib/db";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const Settings = async () => {
  let userDetails: UserDetails | null = null;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  try {
    const id = verify(token?.value as string, process.env.JWT_SECRET as string);
    if (!id) throw new Error("Invalid Token");
    const res: UserDetails[] = await query(
      "SELECT id, firstname, lastname, email FROM USERTABLE WHERE ID =$1",
      [id]
    );
    userDetails = res[0];
  } catch (error: any) {
    console.log(error.message);
  }
  return (
    <section className="settings grow w-full md:h-screen md:overflow-x-hidden">
      <div className="w-11/12 md:w-full mx-auto h-full flex flex-col gap-3">
        <div className="flex justify-between md:w-11/12 mx-auto h-12 md:h-16 items-center">
          <h1 className="text-xl md:text-2xl">Records</h1>
          <div className="hidden md:inline-block md:py-2">
            <ModeToggle />
          </div>
        </div>
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-3 pb-5">
            <UserInfo userDetails={userDetails} />
            <ChangePassword userId={userDetails?.id} />
            <DeleteAccount userId={userDetails?.id} />
          </div>
        </ScrollArea>
      </div>
    </section>
  );
};

export default Settings;
