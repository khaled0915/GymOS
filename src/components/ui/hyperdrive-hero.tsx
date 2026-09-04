"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Rocket, ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export interface HyperdriveHeroProps {
  badgeText?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const StarfieldCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    const numStars = 800;
    let speed = 2;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };

    class Star {
      x: number;
      y: number;
      z: number;
      pz: number;

      constructor() {
        this.x = Math.random() * canvas!.width - canvas!.width / 2;
        this.y = Math.random() * canvas!.height - canvas!.height / 2;
        this.z = Math.random() * canvas!.width;
        this.pz = this.z;
      }

      update() {
        this.z = this.z - speed;
        if (this.z < 1) {
          this.z = canvas!.width;
          this.x = Math.random() * canvas!.width - canvas!.width / 2;
          this.y = Math.random() * canvas!.height - canvas!.height / 2;
          this.pz = this.z;
        }
      }

      draw() {
        if (!ctx || !canvas) return;
        const sx = (this.x / this.z) * (canvas.width / 2) + canvas.width / 2;
        const sy = (this.y / this.z) * (canvas.height / 2) + canvas.height / 2;
        const size = Math.max(0.1, (1 - this.z / canvas.width) * 2.5);
        const px = (this.x / this.pz) * (canvas.width / 2) + canvas.width / 2;
        const py = (this.y / this.pz) * (canvas.height / 2) + canvas.height / 2;
        this.pz = this.z;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.lineWidth = size * 2;
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - this.z / canvas.width)})`;
        ctx.stroke();
      }
    }

    const init = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.update();
        star.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - centerX);
      const maxDist = Math.max(window.innerWidth / 2, rect.width / 2);
      speed = 2 + Math.max(0, 1 - dist / maxDist) * 20;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    resizeCanvas();
    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full pointer-events-none" />;
};

export function HyperdriveHero({
  badgeText = "Next-Generation Deployment Platform",
  title = "Hyperdrive",
  description = "Launch your applications at the speed of light. Our platform provides the infrastructure to build, scale, and deploy globally in seconds.",
  buttonText = "Engage Thrusters",
  buttonHref = "/register",
  onButtonClick,
  className,
  children,
}: HyperdriveHeroProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2 + 0.3,
        duration: 0.8,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div
      className={cn(
        "relative min-h-[580px] md:min-h-[680px] w-full bg-black flex flex-col items-center justify-center overflow-hidden py-20 sm:py-24 rounded-3xl border border-white/10 shadow-2xl shadow-emerald-950/20",
        className
      )}
    >
      <StarfieldCanvas />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10 pointer-events-none" />
      <div className="relative z-20 text-center px-6 max-w-3xl mx-auto space-y-6">
        <motion.div
          custom={0}
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-2 backdrop-blur-sm shadow-sm"
        >
          <Rocket className="h-4 w-4 text-indigo-300" />
          <span className="text-sm font-medium text-gray-200">
            {badgeText}
          </span>
        </motion.div>

        <motion.h2
          custom={1}
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400"
        >
          {title}
        </motion.h2>

        <motion.p
          custom={2}
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed font-normal"
        >
          {description}
        </motion.p>

        <motion.div
          custom={3}
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {buttonHref ? (
            <Link
              href={buttonHref}
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 active:scale-95 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              {buttonText}
              <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <button
              onClick={onButtonClick}
              className="px-8 py-4 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 active:scale-95 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              {buttonText}
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </motion.div>

        {children && (
          <motion.div
            custom={4}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default HyperdriveHero;
