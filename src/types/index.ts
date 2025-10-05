// src/types/index.ts

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?:
    | string
    | {
        message: string;
        details?: any;
      };
}

// Form status type
export type FormStatus = "idle" | "loading" | "success" | "error";

// Email service types
export interface EmailTemplate {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  data?: { id: string };
  error?: {
    message: string;
    name?: string;
  };
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NewsletterData {
  email: string;
  name?: string;
}

export interface BookingData {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  message?: string;
}

// Component common props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Section props
export interface SectionProps extends BaseComponentProps {
  id?: string;
  containerClassName?: string;
}

// Button variants
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

// Input types
export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search";

// Animation variants
export interface AnimationConfig {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  viewport?: {
    once?: boolean;
    amount?: number;
  };
}

// SEO types
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}

// Testimonial type
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  image?: string;
  rating?: number;
}

// FAQ type
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

// Feature type
export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
}

// Pricing plan type
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  interval?: "month" | "year";
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

// Team member type
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
}

// Calendly types
export interface CalendlyEvent {
  uri: string;
  name: string;
  status: "active" | "inactive";
  start_time: string;
  end_time: string;
  invitees_count: number;
}

export interface CalendlyInvitee {
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  canceled: boolean;
  cancellation_reason?: string;
}

// Webhook payload type
export interface WebhookPayload<T = any> {
  event: string;
  payload: T;
  created_at: string;
}

// Filter and sort types
export type SortOrder = "asc" | "desc";

export interface FilterOptions {
  category?: string;
  search?: string;
  tags?: string[];
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
  total: number;
}

// Form field types
export interface FormField {
  name: string;
  label: string;
  type: InputType;
  placeholder?: string;
  required?: boolean;
  validation?: any;
  helperText?: string;
}

// Modal types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

// Toast/notification types
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Loading state types
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
  data?: any;
}

// Generic data fetching types
export interface UseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
