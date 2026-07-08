import { HeroSection } from "@/features/landing/components/HeroSection"
import { BrandCarousel } from "@/features/landing/components/BrandCarousel"
import { HowItWorks } from "@/features/landing/components/HowItWorks"
import { FeaturedFleet } from "@/features/landing/components/FeaturedFleet"
import { WhyChooseUs } from "@/features/landing/components/WhyChooseUs"
import { Destinations } from "@/features/landing/components/Destinations"
import { Testimonials } from "@/features/landing/components/Testimonials"

export function LandingPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <HeroSection />
      <BrandCarousel />
      <HowItWorks />
      <FeaturedFleet />
      <WhyChooseUs />
      <Destinations />
      <Testimonials />
    </div>
  )
}
