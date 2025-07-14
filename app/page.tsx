import { Features } from "./components/Features";
import HomeSection from "./components/HomeSection";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";

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
