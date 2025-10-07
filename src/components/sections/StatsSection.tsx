"use client";

import React from "react";
import { Stats, type StatsConfig } from "./Stats";
import { cn } from "@/lib/utils";

export interface StatsSectionProps {
  title?: string;
  subtitle?: string;
  config: StatsConfig;
  className?: string;
  containerClassName?: string;
}

export function StatsSection({
  title,
  subtitle,
  config,
  className,
  containerClassName,
}: StatsSectionProps) {
  return (
    <section className={cn("py-16 md:py-20", className)}>
      <div
        className={cn("container mx-auto px-4 max-w-7xl", containerClassName)}
      >
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && (
              <p className="text-primary-600 font-semibold mb-2">{subtitle}</p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {title}
              </h2>
            )}
          </div>
        )}

        <Stats config={config} />
      </div>
    </section>
  );
}
