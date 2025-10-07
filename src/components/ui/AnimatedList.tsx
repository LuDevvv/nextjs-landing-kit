"use client";

import React, { ReactNode } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
  animation?: "fadeIn" | "slideUp" | "slideIn" | "slideInLeft" | "scaleIn";
  staggerDelay?: number;
  threshold?: number;
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

export function AnimatedList({
  children,
  className = "",
  animation = "slideUp",
  staggerDelay = 100,
  threshold = 0.1,
}: AnimatedListProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    triggerOnce: true,
    rootMargin: "50px",
  });

  const animationConfig = animations[animation];

  return (
    <div ref={ref as any} className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={`
            ${animationConfig.transition}
            duration-700
            ease-out
            ${isVisible ? animationConfig.animate : animationConfig.initial}
          `.trim()}
          style={{
            transitionDelay: isVisible ? `${index * staggerDelay}ms` : "0ms",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
