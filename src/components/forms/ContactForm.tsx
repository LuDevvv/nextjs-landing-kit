"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, Phone, MessageSquare, Clock } from "lucide-react";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { Input } from "@/components/ui/forms/Input";
import { Textarea } from "@/components/ui/forms/Textarea";
import { Select } from "@/components/ui/forms/Select";
import { Button } from "@/components/ui/forms/Button";
import { DatePicker } from "@/components/ui/forms/DatePicker";

export interface ContactFormConfig {
  showPhone?: boolean;
  showDate?: boolean;
  showTime?: boolean;
  showSubject?: boolean;
  submitButtonText?: string;
  successMessage?: string;
  errorMessage?: string;
  placeholders?: {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
    date?: string;
  };
  timeSlots?: string[];
  apiEndpoint?: string;
  onSuccess?: (data: ContactFormData) => void;
  onError?: (error: any) => void;
}

interface ContactFormProps {
  config?: ContactFormConfig;
  className?: string;
}

export function ContactForm({ config, className }: ContactFormProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Default configuration
  const defaultConfig: ContactFormConfig = {
    showPhone: false,
    showDate: false,
    showTime: false,
    showSubject: true,
    submitButtonText: "Send Message",
    successMessage: "Message sent successfully! We'll get back to you soon.",
    errorMessage: "Failed to send message. Please try again.",
    placeholders: {
      name: "Your Name",
      email: "your@email.com",
      phone: "+1 (555) 123-4567",
      subject: "Subject",
      message: "Your message...",
      date: "Select a date",
    },
    timeSlots: [
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ],
    apiEndpoint: "/api/contact",
  };

  const finalConfig = { ...defaultConfig, ...config };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const formatTimeForDisplay = (time: string) => {
    const [hour] = time.split(":");
    const hourNum = parseInt(hour);
    if (hourNum >= 13) {
      return `${hourNum - 12}:00 PM`;
    } else if (hourNum === 12) {
      return `${time} PM`;
    } else {
      return `${time} AM`;
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");

    try {
      const response = await fetch(finalConfig.apiEndpoint!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("success");
        reset();
        setSelectedDate(undefined);
        finalConfig.onSuccess?.(data);

        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        finalConfig.onError?.(result.error);

        setTimeout(() => setStatus("idle"), 8000);
      }
    } catch (error) {
      setStatus("error");
      finalConfig.onError?.(error);
      console.error("Contact form error:", error);

      setTimeout(() => setStatus("idle"), 8000);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setValue("date", date.toISOString().split("T")[0]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Name Input */}
        <Input
          {...register("name")}
          label="Name"
          placeholder={finalConfig.placeholders?.name}
          icon={<User size={18} />}
          error={errors.name?.message}
          fullWidth
        />

        {/* Email Input */}
        <Input
          {...register("email")}
          type="email"
          label="Email"
          placeholder={finalConfig.placeholders?.email}
          icon={<Mail size={18} />}
          error={errors.email?.message}
          fullWidth
        />
      </div>

      {/* Phone Input (Optional) */}
      {finalConfig.showPhone && (
        <div className="mb-4">
          <Input
            {...register("phone")}
            type="tel"
            label="Phone"
            placeholder={finalConfig.placeholders?.phone}
            icon={<Phone size={18} />}
            error={errors.phone?.message}
            fullWidth
          />
        </div>
      )}

      {/* Date and Time Row (Optional) */}
      {(finalConfig.showDate || finalConfig.showTime) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {finalConfig.showDate && (
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              label="Preferred Date"
              placeholder={finalConfig.placeholders?.date}
              error={errors.date?.message}
              disablePast
              disableSundays
              fullWidth
            />
          )}

          {finalConfig.showTime && (
            <Select
              {...register("time")}
              label="Preferred Time"
              icon={<Clock size={18} />}
              error={errors.time?.message}
              options={
                finalConfig.timeSlots?.map((time) => ({
                  value: time,
                  label: formatTimeForDisplay(time),
                })) || []
              }
              fullWidth
            />
          )}
        </div>
      )}

      {/* Subject Input (Optional) */}
      {finalConfig.showSubject && (
        <div className="mb-4">
          <Input
            {...register("subject")}
            label="Subject"
            placeholder={finalConfig.placeholders?.subject}
            error={errors.subject?.message}
            fullWidth
          />
        </div>
      )}

      {/* Message Textarea */}
      <div className="mb-6">
        <Textarea
          {...register("message")}
          label="Message"
          placeholder={finalConfig.placeholders?.message}
          icon={<MessageSquare size={18} />}
          error={errors.message?.message}
          rows={5}
          fullWidth
        />
      </div>

      {/* Submit Button */}
      <div className="flex flex-col items-start gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={status === "loading"}
          loadingText="Sending..."
          disabled={status === "loading"}
          fullWidth
        >
          {finalConfig.submitButtonText}
        </Button>

        {/* Success Message */}
        {status === "success" && (
          <div
            className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 p-4 rounded-lg shadow-sm animate-slide-up"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium">Success!</p>
                <p className="text-sm text-green-600 mt-1">
                  {finalConfig.successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {status === "error" && (
          <div
            className="w-full bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-800 p-4 rounded-lg shadow-sm animate-slide-up"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium">Error</p>
                <p className="text-sm text-red-600 mt-1">
                  {finalConfig.errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
