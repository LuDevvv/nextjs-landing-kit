"use client";

import { useEffect } from "react";
import {
  calendlyService,
  type CalendlyConfig,
} from "@/lib/services/calendly.service";

interface CalendlyInlineProps {
  config?: Partial<CalendlyConfig>;
  className?: string;
  minHeight?: string;
}

export function CalendlyInline({
  config,
  className = "",
  minHeight = "700px",
}: CalendlyInlineProps) {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script");
    script.src = calendlyService.getEmbedScriptUrl();
    script.async = true;
    document.body.appendChild(script);

    // Load Calendly styles
    const link = document.createElement("link");
    link.href = calendlyService.getEmbedStyleUrl();
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  if (!calendlyService.isConfigured()) {
    return (
      <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          ⚠️ Calendly is not configured. Please set NEXT_PUBLIC_CALENDLY_URL in
          your environment variables.
        </p>
      </div>
    );
  }

  const url = calendlyService.getSchedulingUrl(config);

  return (
    <div
      className={`calendly-inline-widget ${className}`}
      data-url={url}
      style={{ minWidth: "320px", height: minHeight }}
    />
  );
}
