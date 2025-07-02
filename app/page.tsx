import { Features } from "./components/Features";
import HomeSection from "./components/HomeSection";
import Navbar from "./components/Navbar";
import { Separator } from "@/components/ui/separator";
import { Footer } from "./components/Footer";
import { cookies } from "next/headers";
import { JwtPayload, verify } from "jsonwebtoken";

export default async function Home() {
  
  return (
    <div>
      <Navbar />
      <HomeSection />
      <Features />
      <Footer />
    </div>
  );
}
