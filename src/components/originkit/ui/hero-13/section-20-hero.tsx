"use client";

import GalleryTunnel from "@/components/originkit/ui/hero-13/gallery-tunnel";
import { HeroContent } from "@/components/originkit/ui/hero-13/hero-content";

interface Section20HeroProps {
  isLoggedIn?: boolean;
}

/** Curated high-resolution athletic and gym photography for the 3D tunnel */
const GYM_IMAGES = [
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop", // Barbell workout
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop", // Gym dumbbells
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop", // Heavy deadlift
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop", // Squat rack
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop", // Arm training
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop", // Athlete conditioning
];

export const Section20Hero = ({ isLoggedIn = false }: Section20HeroProps) => {
  return (
    <section
      aria-label="GymOS - The Athlete's Operating System"
      className="relative isolate flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-[#0d0f12]"
    >
      {/* 3D gym photography tunnel */}
      <div
        aria-hidden="true"
        className="pointer-events-auto absolute inset-0 z-0 opacity-85"
      >
        <GalleryTunnel
          images={GYM_IMAGES}
          background="#0d0f12"
          lineColor="#10b981"
          lineOpacity={20}
          grid={6}
          speed={45}
          boost={90}
          fade={100}
          label={false}
        />
      </div>

      {/* Smooth radial vignette wash behind text so copy stays readable while 3D gym images blend naturally */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-[85vh] w-[100vw] sm:w-[65vw] -translate-x-1/2 -translate-y-1/2 bg-[#0d0f12]/85 blur-[35px]"
      />

      <div className="pointer-events-none relative z-20 flex w-full max-w-[800px] items-center justify-center py-12">
        <div className="pointer-events-auto relative flex w-full items-center justify-center">
          <HeroContent isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </section>
  );
};
