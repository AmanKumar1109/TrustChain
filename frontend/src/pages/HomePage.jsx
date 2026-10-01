import React from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/hero/HeroSection';
import PartnersBar from '../components/layout/PartnersBar';

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-[#07080a] flex flex-col justify-between font-sans selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Center Hero Experience */}
      <HeroSection />

      {/* Bottom Partner Brands Bar */}
      <PartnersBar />
    </main>
  );
}
