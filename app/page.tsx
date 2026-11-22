import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/home/hero"
import { FeaturedSection, CategoriesSection, WhySection, HowItWorks, OwnerCTA, ReviewsSection } from "@/components/home/sections";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar></Navbar>
      <main>
        <Hero></Hero>
        <FeaturedSection></FeaturedSection>
        <WhySection></WhySection>
        <HowItWorks></HowItWorks>
        <ReviewsSection></ReviewsSection>
        <OwnerCTA></OwnerCTA>
      </main>   
      <Footer></Footer> 
    </>
  );
}
