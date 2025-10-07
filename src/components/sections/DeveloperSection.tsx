import React from "react";
import { DeveloperInfo, type DeveloperConfig } from "./DeveloperInfo";
import { cn } from "@/lib/utils";

interface DeveloperSectionProps {
  configs: DeveloperConfig[];
  layout?: "1-column" | "2-columns" | "3-columns";
  sectionTitle?: string;
  sectionSubtitle?: string;
  className?: string;
}

export function DeveloperSection({
  configs,
  layout = "1-column",
  sectionTitle,
  sectionSubtitle,
  className,
}: DeveloperSectionProps) {
  const gridClasses = {
    "1-column": "grid-cols-1",
    "2-columns": "grid-cols-1 md:grid-cols-2",
    "3-columns": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <section className={cn("py-16 md:py-20 bg-gray-50", className)}>
      <div className="container mx-auto px-4 max-w-7xl">
        {(sectionTitle || sectionSubtitle) && (
          <div className="text-center mb-12">
            {sectionSubtitle && (
              <p className="text-primary-600 font-semibold mb-2">
                {sectionSubtitle}
              </p>
            )}
            {sectionTitle && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {sectionTitle}
              </h2>
            )}
          </div>
        )}

        <div className={cn("grid gap-8", gridClasses[layout])}>
          {configs.map((config, index) => (
            <DeveloperInfo key={index} config={config} />
          ))}
        </div>
      </div>
    </section>
  );
}
