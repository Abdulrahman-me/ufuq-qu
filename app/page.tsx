import { LandingHero } from "@/components/landing/LandingHero";
import { LandingProductDemo } from "@/components/landing/LandingProductDemo";
import { LandingSanadDemo } from "@/components/landing/LandingSanadDemo";
import { LandingPassportDemo } from "@/components/landing/LandingPassportDemo";
import { LandingSections } from "@/components/landing/LandingSections";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="landing-mesh pointer-events-none fixed inset-0 -z-10" aria-hidden />
      <LandingHero />
      <LandingProductDemo />
      <LandingSanadDemo />
      <LandingPassportDemo />
      <LandingSections />
    </div>
  );
}
