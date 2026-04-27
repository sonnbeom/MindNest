import CtaFooterSection from "@/components/sections/disclaimer";
import FaqSection from "@/components/sections/faq";
import HeroSection from "@/components/sections/hero";
import HowItWorksSection from "@/components/sections/how-it-works";
import NavSection from "@/components/sections/nav";

export default function Home() {
  return (
    <>
      <NavSection />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FaqSection />
        <CtaFooterSection />
      </main>
    </>
  );
}
