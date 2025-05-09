import { Benefits } from "@/components/benefits";
import { Compatibility } from "@/components/compatability";
import { Examples } from "@/components/examples";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Examples />
        <Compatibility />
      </main>
      <Footer />
    </div>
  );
}
