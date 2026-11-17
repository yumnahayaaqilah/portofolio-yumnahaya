import Hero from "@/components/Hero";
import { About, Contact, Footer, Marquee, Projects, Stack } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Projects />
      <Stack />
      <Contact />
      <Footer />
    </>
  );
}
