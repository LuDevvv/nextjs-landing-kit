"use client";

import React, { ReactNode, ElementType } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "fadeIn" | "slideUp" | "slideIn" | "slideInLeft" | "scaleIn";
  delay?: number;
  duration?: number;
  threshold?: number;
  as?: ElementType;
}

const animations = {
  fadeIn: {
    initial: "opacity-0",
    animate: "opacity-100",
    transition: "transition-opacity",
  },
  slideUp: {
    initial: "opacity-0 translate-y-8",
    animate: "opacity-100 translate-y-0",
    transition: "transition-all",
  },
  slideIn: {
    initial: "opacity-0 translate-x-8",
    animate: "opacity-100 translate-x-0",
    transition: "transition-all",
  },
  slideInLeft: {
    initial: "opacity-0 -translate-x-8",
    animate: "opacity-100 translate-x-0",
    transition: "transition-all",
  },
  scaleIn: {
    initial: "opacity-0 scale-95",
    animate: "opacity-100 scale-100",
    transition: "transition-all",
  },
};

export function AnimatedSection({
  children,
  className = "",
  animation = "fadeIn",
  delay = 0,
  duration = 700,
  threshold = 0.1,
  as: Component = "div",
}: AnimatedSectionProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    triggerOnce: true,
    rootMargin: "100px",
  });

  const animationConfig = animations[animation];

  const durationClass =
    duration === 300
      ? "duration-300"
      : duration === 500
        ? "duration-500"
        : duration === 700
          ? "duration-700"
          : duration === 1000
            ? "duration-1000"
            : "duration-700";

  const delayClass =
    delay === 100
      ? "delay-100"
      : delay === 200
        ? "delay-200"
        : delay === 300
          ? "delay-300"
          : delay === 400
            ? "delay-[400ms]"
            : delay === 500
              ? "delay-500"
              : delay === 600
                ? "delay-[600ms]"
                : delay === 800
                  ? "delay-[800ms]"
                  : "";

  return React.createElement(
    Component,
    {
      ref: ref as any,
      className: `
        ${animationConfig.transition}
        ${durationClass}
        ${delayClass}
        ease-out
        ${isVisible ? animationConfig.animate : animationConfig.initial}
        ${className}
      `.trim(),
    },
    children
  );
}
