"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface FilterOption<T = string> {
  value: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface FilterTabsProps<T = string> {
  options: FilterOption<T>[];
  activeFilter: T;
  onFilterChange: (filter: T) => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  showCount?: boolean;
  className?: string;
}

export function FilterTabs<T extends string = string>({
  options,
  activeFilter,
  onFilterChange,
  variant = "primary",
  size = "md",
  fullWidth = false,
  showCount = false,
  className,
}: FilterTabsProps<T>) {
  const variantClasses = {
    primary: {
      active: "bg-primary-600 text-white shadow-sm",
      inactive: "text-gray-700 hover:bg-gray-50",
    },
    secondary: {
      active: "bg-gray-800 text-white shadow-sm",
      inactive: "text-gray-700 hover:bg-gray-50",
    },
    outline: {
      active: "border-2 border-primary-600 text-primary-600 bg-primary-50",
      inactive: "border-2 border-gray-200 text-gray-700 hover:border-gray-300",
    },
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 sm:px-6 py-2.5 text-sm",
    lg: "px-6 sm:px-8 py-3 text-base",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full overflow-x-auto scrollbar-hide px-4 py-2">
        <div className={cn("flex", fullWidth ? "w-full" : "justify-center")}>
          <div
            className={cn(
              "inline-flex bg-white rounded-xl p-1.5 gap-1 shadow-lg border border-gray-100",
              fullWidth ? "w-full" : "min-w-max"
            )}
          >
            {options.map((option) => (
              <button
                key={String(option.value)}
                onClick={() => onFilterChange(option.value)}
                className={cn(
                  "rounded-lg font-medium transition-all duration-200 whitespace-nowrap",
                  "flex items-center gap-2",
                  sizeClasses[size],
                  activeFilter === option.value
                    ? variantClasses[variant].active
                    : variantClasses[variant].inactive,
                  fullWidth && "flex-1 justify-center"
                )}
              >
                {option.icon && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}
                <span>{option.label}</span>
                {showCount && option.count !== undefined && (
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      activeFilter === option.value
                        ? "bg-white/20"
                        : "bg-gray-100"
                    )}
                  >
                    {option.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
