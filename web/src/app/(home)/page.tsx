import { Benefits } from "@/components/benefits";
import { Compatibility } from "@/components/compatability";
import { Examples } from "@/components/examples";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Benefits />
      <Examples />
      <Compatibility />
      <Footer />
    </>
  );
}
