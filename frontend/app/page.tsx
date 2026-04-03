import DisclaimerSection from "@/components/sections/disclaimer";
import FeaturesSection from "@/components/sections/features";
import HeroSection from "@/components/sections/hero";
import HowItWorksSection from "@/components/sections/how-it-works";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <DisclaimerSection />
    </main>
  );
}
