import { Resend } from "resend";
import type { ContactFormData } from "@/lib/validations";

// Email configuration interface
interface EmailConfig {
  companyName?: string;
  companyLogo?: string;
  companyAddress?: string;
  supportEmail?: string;
  primaryColor?: string;
}

// Get email configuration from environment
const getEmailConfig = (): EmailConfig => ({
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || "Your Company",
  companyLogo: process.env.NEXT_PUBLIC_COMPANY_LOGO || "",
  companyAddress: process.env.NEXT_PUBLIC_ADDRESS || "",
  supportEmail: process.env.NEXT_PUBLIC_EMAIL || "",
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#3b82f6",
});

export class EmailService {
  private resend: Resend;
  private config: EmailConfig;

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.config = getEmailConfig();
  }

  // Send contact form email
  async sendContactEmail(data: ContactFormData) {
    try {
      const emailPayload = {
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: process.env.EMAIL_TO!,
        replyTo: data.email,
        subject: `New Contact: ${data.name} - ${data.subject}`,
        html: this.createContactEmailTemplate(data),
      };

      const { data: result, error } =
        await this.resend.emails.send(emailPayload);

      if (error) {
        console.error("❌ Resend API Error:", {
          error,
          message: error.message,
          timestamp: new Date().toISOString(),
        });

        return {
          success: false,
          error: {
            message: error.message,
            name: error.name,
          },
        };
      }

      // Send auto-reply to customer
      await this.sendAutoReply(data.email, data.name);

      return {
        success: true,
        data: result,
      };
    } catch (err: any) {
      console.error("❌ Critical error:", {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        error: {
          message: err.message || "Unknown error",
          type: "CRITICAL_ERROR",
        },
      };
    }
  }

  // Send auto-reply to customer
  async sendAutoReply(to: string, name: string) {
    try {
      await this.resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to,
        subject: `Thank you for contacting ${this.config.companyName}!`,
        html: this.createAutoReplyTemplate(name),
      });
    } catch (error) {
      console.error("❌ Auto-reply failed:", error);
      // Don't throw - auto-reply failure shouldn't block main flow
    }
  }

  // Send newsletter subscription confirmation
  async sendNewsletterConfirmation(email: string, name?: string) {
    try {
      const { data: result, error } = await this.resend.emails.send({
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
        to: email,
        subject: `Welcome to ${this.config.companyName} Newsletter!`,
        html: this.createNewsletterTemplate(name || "Subscriber"),
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data: result };
    } catch (err: any) {
      return {
        success: false,
        error: { message: err.message },
      };
    }
  }

  // Contact form email template
  private createContactEmailTemplate(data: ContactFormData): string {
    const hasPhone = data.phone && data.phone.trim().length > 0;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Contact - ${this.sanitizeHTML(this.config.companyName!)}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.adjustColor(this.config.primaryColor!, -20)} 100%);padding:32px 40px;text-align:center;">
                  ${this.config.companyLogo ? `<img src="${this.config.companyLogo}" alt="${this.config.companyName}" style="max-width:150px;height:auto;margin-bottom:16px;"/>` : ""}
                  <h1 style="margin:0;font-size:28px;color:#ffffff;font-weight:600;">New Contact Received</h1>
                  <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">From your website contact form</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <h2 style="margin:0 0 24px;color:#18181b;font-size:20px;font-weight:600;">Contact Details</h2>
                  
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #e4e4e7;">
                        <span style="color:#71717a;font-size:14px;">Name</span><br/>
                        <strong style="color:#18181b;font-size:16px;">${this.sanitizeHTML(data.name)}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #e4e4e7;">
                        <span style="color:#71717a;font-size:14px;">Email</span><br/>
                        <a href="mailto:${this.sanitizeHTML(data.email)}" style="color:${this.config.primaryColor};font-size:16px;text-decoration:none;font-weight:500;">${this.sanitizeHTML(data.email)}</a>
                      </td>
                    </tr>
                    ${
                      hasPhone
                        ? `
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #e4e4e7;">
                        <span style="color:#71717a;font-size:14px;">Phone</span><br/>
                        <a href="tel:${this.sanitizeHTML(data.phone!)}" style="color:${this.config.primaryColor};font-size:16px;text-decoration:none;font-weight:500;">${this.sanitizeHTML(data.phone!)}</a>
                      </td>
                    </tr>
                    `
                        : ""
                    }
                    <tr>
                      <td style="padding:12px 0;">
                        <span style="color:#71717a;font-size:14px;">Subject</span><br/>
                        <strong style="color:#18181b;font-size:16px;">${this.sanitizeHTML(data.subject)}</strong>
                      </td>
                    </tr>
                  </table>

                  <div style="background-color:#f4f4f5;padding:20px;border-radius:8px;border-left:4px solid ${this.config.primaryColor};">
                    <h3 style="margin:0 0 12px;color:#18181b;font-size:16px;font-weight:600;">Message</h3>
                    <p style="margin:0;color:#3f3f46;font-size:15px;line-height:1.6;white-space:pre-wrap;">${this.sanitizeHTML(data.message)}</p>
                  </div>

                  <div style="margin-top:24px;padding:16px;background-color:#fef3c7;border-radius:8px;border-left:4px solid #f59e0b;">
                    <p style="margin:0;color:#92400e;font-size:14px;"><strong>⚡ Quick Action:</strong> Reply directly to this email to respond to ${this.sanitizeHTML(data.name)}</p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#fafafa;padding:24px 40px;text-align:center;border-top:1px solid #e4e4e7;">
                  <p style="margin:0 0 8px;font-size:14px;color:#71717a;">
                    ${this.config.companyName}
                    ${this.config.companyAddress ? `<br/>${this.sanitizeHTML(this.config.companyAddress)}` : ""}
                  </p>
                  <p style="margin:0;font-size:12px;color:#a1a1aa;">
                    Sent: ${new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }

  // Auto-reply template
  private createAutoReplyTemplate(name: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Thank You - ${this.sanitizeHTML(this.config.companyName!)}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.adjustColor(this.config.primaryColor!, -20)} 100%);padding:32px 40px;text-align:center;">
                  ${this.config.companyLogo ? `<img src="${this.config.companyLogo}" alt="${this.config.companyName}" style="max-width:150px;height:auto;margin-bottom:16px;"/>` : ""}
                  <h1 style="margin:0;font-size:28px;color:#ffffff;font-weight:600;">Thank You for Reaching Out!</h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <p style="margin:0 0 20px;color:#18181b;font-size:16px;line-height:1.6;">
                    Hi <strong>${this.sanitizeHTML(name)}</strong>,
                  </p>
                  
                  <p style="margin:0 0 20px;color:#3f3f46;font-size:16px;line-height:1.6;">
                    Thank you for contacting <strong>${this.config.companyName}</strong>! We've received your message and will get back to you as soon as possible, typically within 24 hours.
                  </p>

                  <div style="background-color:#dbeafe;padding:20px;border-radius:8px;border-left:4px solid ${this.config.primaryColor};margin:24px 0;">
                    <p style="margin:0;color:#1e40af;font-size:14px;line-height:1.6;">
                      <strong>💡 Quick Tip:</strong> Check your spam folder if you don't see our reply in your inbox. Add ${this.config.supportEmail} to your contacts to ensure our emails reach you.
                    </p>
                  </div>

                  <p style="margin:24px 0 0;color:#3f3f46;font-size:16px;line-height:1.6;">
                    In the meantime, feel free to explore our website or connect with us on social media.
                  </p>

                  <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e4e4e7;">
                    <p style="margin:0 0 8px;color:#71717a;font-size:14px;">Best regards,</p>
                    <p style="margin:0;color:#18181b;font-size:16px;font-weight:600;">${this.config.companyName} Team</p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#fafafa;padding:24px 40px;text-align:center;border-top:1px solid #e4e4e7;">
                  <p style="margin:0 0 8px;font-size:14px;color:#71717a;">
                    ${this.config.companyName}
                    ${this.config.companyAddress ? `<br/>${this.sanitizeHTML(this.config.companyAddress)}` : ""}
                    ${this.config.supportEmail ? `<br/><a href="mailto:${this.config.supportEmail}" style="color:${this.config.primaryColor};text-decoration:none;">${this.config.supportEmail}</a>` : ""}
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }

  // Newsletter template
  private createNewsletterTemplate(name: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Welcome - ${this.sanitizeHTML(this.config.companyName!)}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
              
              <tr>
                <td style="background:linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.adjustColor(this.config.primaryColor!, -20)} 100%);padding:32px 40px;text-align:center;">
                  ${this.config.companyLogo ? `<img src="${this.config.companyLogo}" alt="${this.config.companyName}" style="max-width:150px;height:auto;margin-bottom:16px;"/>` : ""}
                  <h1 style="margin:0;font-size:28px;color:#ffffff;font-weight:600;">Welcome to Our Newsletter! 🎉</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:40px;">
                  <p style="margin:0 0 20px;color:#18181b;font-size:16px;line-height:1.6;">
                    Hi <strong>${this.sanitizeHTML(name)}</strong>,
                  </p>
                  
                  <p style="margin:0 0 20px;color:#3f3f46;font-size:16px;line-height:1.6;">
                    Thank you for subscribing to the <strong>${this.config.companyName}</strong> newsletter! You'll now receive:
                  </p>

                  <ul style="margin:0 0 24px;padding-left:24px;color:#3f3f46;font-size:16px;line-height:1.8;">
                    <li>Latest updates and news</li>
                    <li>Exclusive offers and promotions</li>
                    <li>Industry insights and tips</li>
                    <li>New product announcements</li>
                  </ul>

                  <div style="background-color:#d1fae5;padding:20px;border-radius:8px;border-left:4px solid #10b981;margin:24px 0;">
                    <p style="margin:0;color:#065f46;font-size:14px;font-weight:500;">
                      ✅ Your subscription is confirmed! Welcome to the community.
                    </p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="background-color:#fafafa;padding:24px 40px;text-align:center;border-top:1px solid #e4e4e7;">
                  <p style="margin:0;font-size:12px;color:#a1a1aa;">
                    You can unsubscribe at any time by clicking the link in any of our emails.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }

  // Utility: Sanitize HTML
  private sanitizeHTML(input: string): string {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Utility: Adjust color brightness
  private adjustColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }
}

// Export singleton instance
export const emailService = new EmailService();
