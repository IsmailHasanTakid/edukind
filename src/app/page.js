import Image from "next/image";

import EcosystemShowcase from "@/components/ecosystem/EcosystemShowcase";
import HeroSection from "@/components/home/Hero";

export default function Home() {
  return (
    <div >
      <HeroSection />
      <EcosystemShowcase />
    </div>
  );
}
