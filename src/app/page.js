import Image from "next/image";
import Hero from "@/components/home/Hero"
import EcosystemShowcase from "@/components/ecosystem/EcosystemShowcase";

export default function Home() {
  return (
    <div >
      <Hero />
      <EcosystemShowcase />
    </div>
  );
}
