import EcosystemShowcase from "@/components/ecosystem/EcosystemShowcase";
import HeroSection from "@/components/home/Hero";
import MentorPreview from "@/components/home/MentorPreview";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <EcosystemShowcase />
      <MentorPreview />
    </div>
  );
}