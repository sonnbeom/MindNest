"use client";

import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

const steps = [
  { label: "감정 지수", icon: "🌱", stage: "INTAKE" },
  { label: "왜곡 분석", icon: "🔍", stage: "DISTORTION" },
  { label: "긍정적 재구성", icon: "💡", stage: "REFRAME" },
  { label: "생각 균형 잡기", icon: "⚖️", stage: "DIALOGUE" },
  { label: "오늘의 마무리", icon: "🌿", stage: "CLOSE" },
];

export default function HeroSection() {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gradientRef.current) return;
    gsap.fromTo(
      gradientRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1.6, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="p-6 overflow-hidden rounded-xl">
      <div className="relative w-full">
        <div
          ref={gradientRef}
          className="absolute inset-0 -z-10 transition-colors duration-700 dark:bg-black max-h-[90vh] rounded-2xl"
          style={{
            backgroundImage: `
              linear-gradient(180deg, #ffffff 0%, #FFEDD5 25%, #FFDAB9 50%, #FFB6C1 70%, #E0BBE4 85%, #F3E5F5 100%),
              radial-gradient(at 20% 30%, #ffffff33 0%, transparent 60%),
              radial-gradient(at 80% 70%, #f3e5f533 0%, transparent 70%)
            `,
            backgroundBlendMode: "overlay, screen",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}
        />

        <div className="pt-4 pb-10 sm:pt-6 sm:pb-12 text-center">
          <div className="relative max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-pink-100 text-sm text-pink-500 font-medium mb-6 backdrop-blur-sm">
              <span>🧠</span>
              <span>인지 왜곡 기반 셀프 심리 상담</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl text-gray-800 dark:text-gray-200 font-bold tracking-tight">
              마음을 돌보는 공간,{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                MindNest
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              인지 왜곡을 분석하고, 생각을 바꾸면서 감정도 바꿀 수 있어요.
              <br className="hidden sm:block" />
              스스로 마음을 돌보는 5단계 여정입니다.
            </p>
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
            >
              <div
                className="rounded-[14px] border p-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, #f9a8d4, #c084fc, #a78bfa)",
                }}
              >
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl px-5 text-base bg-white text-gray-800 hover:bg-gray-50"
                >
                  <Link href="/session">
                    <span className="text-nowrap">상담 시작하기</span>
                  </Link>
                </Button>
              </div>
              <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="rounded-xl px-5 text-base text-gray-600 dark:text-gray-300"
                >
                  <a href="#how-it-works">
                    <span className="text-nowrap">서비스 소개 →</span>
                  </a>
                </Button>
              </div>
            </AnimatedGroup>
          </div>
        </div>

        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.9,
                },
              },
            },
            ...transitionVariants,
          }}
        >
          <div className="relative overflow-hidden px-2 pb-10">
            <div
              aria-hidden
              className="bg-gradient-to-b from-background to-background absolute inset-0 z-10 from-transparent from-35%"
            />
            <div className="relative mx-auto max-w-3xl">
              <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/80 dark:border-white/10 rounded-2xl p-6 shadow-lg shadow-pink-100/30">
                <p className="text-xs text-gray-400 mb-4 text-center font-medium tracking-widest uppercase">
                  5단계 마음 돌봄 여정
                </p>
                <div className="flex items-center justify-between gap-2">
                  {steps.map((step, i) => (
                    <div key={step.stage} className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 border border-pink-100 dark:border-white/20 flex items-center justify-center text-lg shadow-sm">
                          {step.icon}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center leading-tight hidden sm:block">
                          {step.label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-6 h-px bg-gradient-to-r from-pink-200 to-purple-200 flex-shrink-0 hidden sm:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedGroup>
      </div>
    </div>
  );
}
