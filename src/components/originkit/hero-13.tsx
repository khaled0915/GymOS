"use client";

import "./hero-13.css";
import { Section20Hero } from "@/components/originkit/ui/hero-13/section-20-hero";

interface Hero13Props {
  isLoggedIn?: boolean;
}

const Hero13 = ({ isLoggedIn }: Hero13Props) => <Section20Hero isLoggedIn={isLoggedIn} />;

export default Hero13;
