"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface Stat {
  value: string | number;
  label: string;
  prefix?: string;
  suffix?: string;
  color?: string;
}

export interface StatsConfig {
  stats: Stat[];
  layout?: "1-column" | "2-columns";
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  animated?: boolean;
}

interface StatsProps {
  config: StatsConfig;
  className?: string;
}

export function Stats({ config, className }: StatsProps) {
  const {
    stats,
    layout = "1-column",
    backgroundColor = "#fef3f2",
    textColor = "#1f2937",
    accentColor = "#ea580c",
    animated = true,
  } = config;

  return (
    <div
      className={cn(
        "rounded-lg p-8 md:p-12",
        layout === "2-columns" && "grid md:grid-cols-2 gap-8",
        className
      )}
      style={{ backgroundColor }}
    >
      <div
        className={cn("space-y-8", layout === "1-column" && "max-w-md mx-auto")}
      >
        {stats
          .slice(
            0,
            layout === "2-columns" ? Math.ceil(stats.length / 2) : stats.length
          )
          .map((stat, index) => (
            <StatItem
              key={index}
              stat={stat}
              textColor={textColor}
              accentColor={accentColor}
              animated={animated}
              delay={index * 100}
            />
          ))}
      </div>

      {layout === "2-columns" && stats.length > Math.ceil(stats.length / 2) && (
        <div className="space-y-8">
          {stats.slice(Math.ceil(stats.length / 2)).map((stat, index) => (
            <StatItem
              key={index}
              stat={stat}
              textColor={textColor}
              accentColor={accentColor}
              animated={animated}
              delay={(Math.ceil(stats.length / 2) + index) * 100}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface StatItemProps {
  stat: Stat;
  textColor: string;
  accentColor: string;
  animated: boolean;
  delay: number;
}

function StatItem({
  stat,
  textColor,
  accentColor,
  animated,
  delay,
}: StatItemProps) {
  return (
    <div
      className={cn("text-center", animated && "animate-fade-in")}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2"
        style={{
          color: stat.color || accentColor,
        }}
      >
        {stat.prefix}
        {stat.value}
        {stat.suffix}
      </div>
      <p
        className="text-base md:text-lg font-semibold"
        style={{ color: textColor }}
      >
        {stat.label}
      </p>
    </div>
  );
}
