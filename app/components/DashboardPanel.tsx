import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TopNav from "./TopNav";
import AsideNav from "./AsideNav";
import axios from "axios";
import Error from "next/error";
import PageRefreshToast from "./PageRefreshToast";
import { getClient, query } from "@/lib/db";
import { JwtPayload, verify } from "jsonwebtoken";


export async function DashboardPanel() {
  let data:UserDetails;
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) redirect("/");
  try {
    const id: string | JwtPayload = verify(token.value as string,process.env.JWT_SECRET as string);
    const res:UserDetails[] = await query('SELECT id, firstname, lastname,email, balance, budget FROM usertable WHERE id = $1',[id]);
    data  = res[0]
  } catch (error: any) {
    return <PageRefreshToast />;
  }
  return (
    <section className="">
      <nav className="md:hidden w-screen sticky">
        <TopNav userData={data} />
      </nav>
      <aside className="hidden md:inline-block h-full">
        <AsideNav userData={data} />
      </aside>
    </section>
  );
}

export default DashboardPanel;
