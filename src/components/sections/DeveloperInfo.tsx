"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface DeveloperConfig {
  badge?: string;
  logo: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  title?: string;
  description: string;
  highlightText?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

interface DeveloperInfoProps {
  config: DeveloperConfig;
  className?: string;
}

export function DeveloperInfo({ config, className }: DeveloperInfoProps) {
  const {
    badge,
    logo,
    title,
    description,
    highlightText,
    backgroundColor = "#ffffff",
    textColor = "#1f2937",
    accentColor = "#ea580c",
  } = config;

  // Split description to highlight specific text
  const getFormattedDescription = () => {
    if (!highlightText) return description;

    const parts = description.split(highlightText);
    return (
      <>
        {parts[0]}
        <span style={{ color: accentColor, fontWeight: 600 }}>
          {highlightText}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      className={cn(
        "rounded-lg p-8 md:p-10 text-center max-w-md mx-auto",
        className
      )}
      style={{ backgroundColor }}
    >
      {/* Badge */}
      {badge && (
        <div className="mb-6">
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            {badge}
          </span>
        </div>
      )}

      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width || 200}
          height={logo.height || 80}
          className="object-contain"
        />
      </div>

      {/* Title */}
      {title && (
        <h3
          className="text-lg md:text-xl font-bold mb-4"
          style={{ color: textColor }}
        >
          {title}
        </h3>
      )}

      {/* Description */}
      <p
        className="text-sm md:text-base leading-relaxed"
        style={{ color: textColor }}
      >
        {getFormattedDescription()}
      </p>
    </div>
  );
}
