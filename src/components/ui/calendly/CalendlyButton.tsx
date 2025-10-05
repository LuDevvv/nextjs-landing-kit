"use client";

import {
  calendlyService,
  type CalendlyConfig,
} from "@/lib/services/calendly.service";
import { cn } from "@/lib/utils";

interface CalendlyButtonProps {
  config?: Partial<CalendlyConfig>;
  children: React.ReactNode;
  className?: string;
}

export function CalendlyButton({
  config,
  children,
  className,
}: CalendlyButtonProps) {
  const handleClick = () => {
    if (!calendlyService.isConfigured()) {
      console.error("Calendly is not configured");
      return;
    }

    calendlyService.openPopup(config);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "px-6 py-3 bg-primary-600 text-white rounded-lg font-medium",
        "hover:bg-primary-700 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        className
      )}
    >
      {children}
    </button>
  );
}
