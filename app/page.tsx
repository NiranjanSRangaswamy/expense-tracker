import { Features } from "./components/Features";
import HomeSection from "./components/HomeSection";
import Navbar from "./components/Navbar";
import { Separator } from "@/components/ui/separator";
import { Footer } from "./components/Footer";
import { cookies } from "next/headers";
import { JwtPayload, verify } from "jsonwebtoken";

export default function Home() {
  let id: undefined | string | JwtPayload;
  const cookieStore = cookies();
  const token = cookieStore.get("token") || "";
  if (token) {
    id = verify(token.value as string, process.env.JWT_SECRET as string);
  }

  return (
    <div>
      <Navbar userId={id} />
      <HomeSection userId={id} />
      <Features />
      <Footer />
    </div>
  );
}
