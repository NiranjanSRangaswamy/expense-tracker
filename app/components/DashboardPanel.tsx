import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TopNav from "./TopNav";
import AsideNav from "./AsideNav";
import axios from "axios";

export async function DashboardPanel() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) redirect("/");
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/user-details`,
    {
      headers: { Authorization: `Bearer ${token.value}` },
    }
  );
  return (
    <section>
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
