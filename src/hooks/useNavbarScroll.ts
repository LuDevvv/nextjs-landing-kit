"use client";

import { useState, useEffect } from "react";

export function useNavbarScroll() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<
    "up" | "down" | "none"
  >("none");
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const direction = position > lastScrollPosition ? "down" : "up";

      setScrollPosition(position);
      setScrollDirection(direction);
      setLastScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollPosition]);

  return {
    scrollPosition,
    scrollDirection,
    mobileMenuOpen,
    setMobileMenuOpen,
  };
}
