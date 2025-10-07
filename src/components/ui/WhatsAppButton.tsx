"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WhatsAppButtonConfig {
  phoneNumber: string;
  message?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  showOnScroll?: boolean;
  scrollThreshold?: number;
  showAfterDelay?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  hoverColor?: string;
  pulseAnimation?: boolean;
  icon?: "default" | "lucide" | "custom";
  customIcon?: string;
  ariaLabel?: string;
}

interface WhatsAppButtonProps {
  config: WhatsAppButtonConfig;
  className?: string;
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-14 w-14",
  lg: "h-16 w-16",
};

const iconSizes = {
  sm: 24,
  md: 32,
  lg: 40,
};

const positionClasses = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
};

export function WhatsAppButton({ config, className }: WhatsAppButtonProps) {
  const {
    phoneNumber,
    message = "Hello! I am interested in learning more.",
    position = "bottom-right",
    showOnScroll = true,
    scrollThreshold = 300,
    showAfterDelay = 3000,
    size = "md",
    color = "#25D366",
    hoverColor = "#22c55e",
    pulseAnimation = true,
    icon = "default",
    customIcon,
    ariaLabel = "Contact us on WhatsApp",
  } = config;

  const [isVisible, setIsVisible] = useState(!showOnScroll && !showAfterDelay);

  // Clean phone number (remove spaces, dashes, etc.)
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Show after delay
    if (showAfterDelay && !showOnScroll) {
      timeoutId = setTimeout(() => setIsVisible(true), showAfterDelay);
    }

    // Show on scroll
    if (showOnScroll) {
      const handleScroll = () => {
        setIsVisible(window.scrollY > scrollThreshold);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll(); // Check initial scroll position

      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showOnScroll, showAfterDelay, scrollThreshold]);

  const renderIcon = () => {
    const iconSize = iconSizes[size];

    if (icon === "custom" && customIcon) {
      return (
        <Image
          src={customIcon}
          alt="WhatsApp"
          width={iconSize}
          height={iconSize}
          className="object-contain"
        />
      );
    }

    if (icon === "lucide") {
      return <MessageCircle size={iconSize} className="text-white" />;
    }

    // Default WhatsApp icon (SVG)
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4575 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4575 4.15385 17C4.15385 19.5395 4.9084 21.8959 6.17572 23.8543L5.07692 27.4615L8.85558 26.4006C10.7645 27.5783 13.0062 28.8462 16 28.8462Z"
          fill="white"
        />
        <path
          d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
          fill="white"
        />
      </svg>
    );
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "fixed z-50 flex items-center justify-center transform transition-all duration-300",
        positionClasses[position],
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-16 opacity-0 scale-75",
        className
      )}
    >
      {/* Pulsing background */}
      {pulseAnimation && (
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            backgroundColor: color,
            opacity: 0.3,
            animationDuration: "2s",
          }}
        />
      )}

      {/* Button */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          sizeClasses[size]
        )}
        style={{
          backgroundColor: color,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hoverColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = color;
        }}
      >
        {renderIcon()}
      </div>
    </a>
  );
}
