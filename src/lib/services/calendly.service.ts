export interface CalendlyConfig {
  url: string; // Your Calendly scheduling URL
  prefill?: {
    name?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    customAnswers?: Record<string, string>;
  };
  utm?: {
    utmCampaign?: string;
    utmSource?: string;
    utmMedium?: string;
    utmContent?: string;
    utmTerm?: string;
  };
  embedType?: "Inline" | "PopupWidget" | "PopupButton";
  hideEventTypeDetails?: boolean;
  hideLandingPageDetails?: boolean;
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
}

export class CalendlyService {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "";
    this.apiKey = process.env.CALENDLY_API_KEY;

    if (!this.baseUrl) {
      console.warn("⚠️ NEXT_PUBLIC_CALENDLY_URL not configured");
    }
  }

  // Get the Calendly URL with parameters
  getSchedulingUrl(config?: Partial<CalendlyConfig>): string {
    if (!this.baseUrl) {
      throw new Error("Calendly URL is not configured");
    }

    const url = new URL(this.baseUrl);
    const params = new URLSearchParams();

    // Add prefill data
    if (config?.prefill) {
      if (config.prefill.name) params.append("name", config.prefill.name);
      if (config.prefill.email) params.append("email", config.prefill.email);
      if (config.prefill.firstName)
        params.append("first_name", config.prefill.firstName);
      if (config.prefill.lastName)
        params.append("last_name", config.prefill.lastName);

      // Custom answers
      if (config.prefill.customAnswers) {
        Object.entries(config.prefill.customAnswers).forEach(([key, value]) => {
          params.append(`a${key}`, value);
        });
      }
    }

    // Add UTM parameters
    if (config?.utm) {
      if (config.utm.utmCampaign)
        params.append("utm_campaign", config.utm.utmCampaign);
      if (config.utm.utmSource)
        params.append("utm_source", config.utm.utmSource);
      if (config.utm.utmMedium)
        params.append("utm_medium", config.utm.utmMedium);
      if (config.utm.utmContent)
        params.append("utm_content", config.utm.utmContent);
      if (config.utm.utmTerm) params.append("utm_term", config.utm.utmTerm);
    }

    // Add embed settings
    if (config?.hideEventTypeDetails)
      params.append("hide_event_type_details", "1");
    if (config?.hideLandingPageDetails)
      params.append("hide_landing_page_details", "1");
    if (config?.backgroundColor)
      params.append(
        "background_color",
        config.backgroundColor.replace("#", "")
      );
    if (config?.textColor)
      params.append("text_color", config.textColor.replace("#", ""));
    if (config?.primaryColor)
      params.append("primary_color", config.primaryColor.replace("#", ""));

    const queryString = params.toString();
    return queryString ? `${url.toString()}?${queryString}` : url.toString();
  }

  // Open Calendly popup (client-side only)
  openPopup(config?: Partial<CalendlyConfig>): void {
    if (typeof window === "undefined") {
      console.error("openPopup can only be called on the client side");
      return;
    }

    const url = this.getSchedulingUrl(config);

    // @ts-ignore - Calendly widget is loaded via script
    if (window.Calendly) {
      // @ts-ignore
      window.Calendly.initPopupWidget({ url });
    } else {
      console.error("Calendly widget script not loaded");
    }
  }

  // Get embed script URL
  getEmbedScriptUrl(): string {
    return "https://assets.calendly.com/assets/external/widget.js";
  }

  // Get embed stylesheet URL
  getEmbedStyleUrl(): string {
    return "https://assets.calendly.com/assets/external/widget.css";
  }

  // Validate configuration
  isConfigured(): boolean {
    return !!this.baseUrl;
  }

  // Get user info (requires API key)
  async getUserInfo() {
    if (!this.apiKey) {
      throw new Error("Calendly API key is not configured");
    }

    try {
      const response = await fetch("https://api.calendly.com/users/me", {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Calendly API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch Calendly user info:", error);
      throw error;
    }
  }

  // Get scheduled events (requires API key)
  async getScheduledEvents(userUri: string) {
    if (!this.apiKey) {
      throw new Error("Calendly API key is not configured");
    }

    try {
      const response = await fetch(
        `https://api.calendly.com/scheduled_events?user=${encodeURIComponent(userUri)}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Calendly API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch scheduled events:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const calendlyService = new CalendlyService();
