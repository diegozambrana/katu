import { Suspense } from "react";
import { FooterPublic } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header/Header";
import {
  HeroSection,
  WhatIsSection,
  DesignedForSection,
  EasyToUseSection,
  AboutUsSection,
  // ContactSection,
} from "@/features/Home";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <HeroSection />
        <WhatIsSection />
        <DesignedForSection />
        <EasyToUseSection />
        <AboutUsSection />
        {/* <ContactSection /> */}
      </main>
      <Suspense>
        <FooterPublic />
      </Suspense>
    </div>
  );
}
