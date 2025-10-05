"use client";

import { useEffect, useState } from "react";
import {
  calendlyService,
  type CalendlyConfig,
} from "@/lib/services/calendly.service";

export function useCalendly() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!calendlyService.isConfigured()) {
      setError("Calendly is not configured");
      return;
    }

    // Load Calendly script
    const script = document.createElement("script");
    script.src = calendlyService.getEmbedScriptUrl();
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError("Failed to load Calendly script");

    document.body.appendChild(script);

    // Load styles
    const link = document.createElement("link");
    link.href = calendlyService.getEmbedStyleUrl();
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      if (script.parentNode) document.body.removeChild(script);
      if (link.parentNode) document.head.removeChild(link);
    };
  }, []);

  const openPopup = (config?: Partial<CalendlyConfig>) => {
    if (!isLoaded) {
      console.error("Calendly script not loaded yet");
      return;
    }
    calendlyService.openPopup(config);
  };

  return {
    isLoaded,
    error,
    isConfigured: calendlyService.isConfigured(),
    openPopup,
    getSchedulingUrl: (config?: Partial<CalendlyConfig>) =>
      calendlyService.getSchedulingUrl(config),
  };
}
