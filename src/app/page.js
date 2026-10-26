import EcosystemShowcase from "@/components/ecosystem/EcosystemShowcase";
import HeroSection from "@/components/home/Hero";
import LearningIntro from "@/components/home/LearningIntro"
import MentorPreview from "@/components/home/MentorPreview";
import IslamicLearning from "@/components/home/IslamicLearning"
import HumanityIntro from "@/components/home/HumanityIntro"
export default function Home() {
  return (
    <div>
      <HeroSection />
      <EcosystemShowcase />
      <MentorPreview />
      <LearningIntro />
      <IslamicLearning />
      <HumanityIntro />

    </div>
  );
}