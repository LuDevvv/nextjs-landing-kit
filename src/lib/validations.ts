// src/lib/validations.ts
import { z } from "zod";

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/,
      "Name can only contain letters, spaces, hyphens and apostrophes"
    ),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .toLowerCase(),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+]?[\d\s\-\(\)]+$/.test(val),
      "Please enter a valid phone number"
    )
    .refine(
      (val) => !val || val.replace(/\D/g, "").length >= 10,
      "Phone number must be at least 10 digits"
    ),

  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),

  date: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      "Date must be in YYYY-MM-DD format"
    ),

  time: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{2}:\d{2}$/.test(val),
      "Time must be in HH:MM format"
    ),
});

// Newsletter validation schema
export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .toLowerCase(),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .optional(),
});

// Booking/appointment validation schema
export const bookingSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),

  email: z.string().email("Please enter a valid email address").toLowerCase(),

  phone: z
    .string()
    .regex(/^[\+]?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
    .optional(),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),

  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),

  message: z
    .string()
    .max(500, "Message must be less than 500 characters")
    .optional(),
});

// Export types
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
export type BookingData = z.infer<typeof bookingSchema>;
