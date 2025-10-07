"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "twitter" | "linkedin" | "github";
  url: string;
}

export interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
}

export interface EventBanner {
  show: boolean;
  dates?: string;
  hours?: string;
}

export interface FooterConfig {
  logo?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  description?: string;
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  contactInfo?: ContactInfo;
  eventBanner?: EventBanner;
  copyrightText?: string;
  showLegalLinks?: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
  overlay?: string;
}

interface FooterProps {
  config?: FooterConfig;
  className?: string;
}

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
};

export function Footer({ config, className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const defaultConfig: FooterConfig = {
    copyrightText: `© ${currentYear} Your Company. All rights reserved.`,
    showLegalLinks: true,
    backgroundColor: "#1f2937",
    overlay: "rgba(31, 41, 55, 0.9)",
  };

  const finalConfig = { ...defaultConfig, ...config };

  return (
    <footer className={cn("relative text-white", className)}>
      {/* Background Image with Overlay */}
      {finalConfig.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={finalConfig.backgroundImage}
            alt="Footer background"
            fill
            className="object-cover object-center"
            priority={false}
          />
          {finalConfig.overlay && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: finalConfig.overlay }}
            />
          )}
        </div>
      )}

      {/* Solid Background (if no image) */}
      {!finalConfig.backgroundImage && finalConfig.backgroundColor && (
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: finalConfig.backgroundColor }}
        />
      )}

      {/* Event Banner */}
      {finalConfig.eventBanner?.show && (
        <div className="relative z-10 bg-primary-600 py-4">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
              {finalConfig.eventBanner.dates && (
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span className="font-medium">
                    {finalConfig.eventBanner.dates}
                  </span>
                </div>
              )}
              {finalConfig.eventBanner.hours && (
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  <span className="font-medium">
                    {finalConfig.eventBanner.hours}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            {finalConfig.logo && (
              <div className="mb-4">
                <Image
                  src={finalConfig.logo.src}
                  alt={finalConfig.logo.alt}
                  width={finalConfig.logo.width || 200}
                  height={finalConfig.logo.height || 60}
                  className="h-auto"
                />
              </div>
            )}

            {finalConfig.description && (
              <p className="text-white/80 text-sm mb-5 max-w-sm">
                {finalConfig.description}
              </p>
            )}

            {/* Social Media Links */}
            {finalConfig.socialLinks && finalConfig.socialLinks.length > 0 && (
              <div className="flex space-x-3 mt-6">
                {finalConfig.socialLinks.map((social) => {
                  const Icon = socialIcons[social.platform];
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-primary-600 p-2 rounded transition-colors"
                      aria-label={social.platform}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contact Info */}
          {finalConfig.contactInfo && (
            <div>
              <h3 className="text-lg font-semibold mb-5">Contact Us</h3>
              <ul className="space-y-4">
                {finalConfig.contactInfo.address && (
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-primary-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 text-sm">
                      {finalConfig.contactInfo.address}
                    </span>
                  </li>
                )}
                {finalConfig.contactInfo.phone && (
                  <li className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-primary-400 flex-shrink-0" />
                    <a
                      href={`tel:${finalConfig.contactInfo.phone.replace(/\D/g, "")}`}
                      className="text-white/80 text-sm hover:text-white transition-colors"
                    >
                      {finalConfig.contactInfo.phone}
                    </a>
                  </li>
                )}
                {finalConfig.contactInfo.email && (
                  <li className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-primary-400 flex-shrink-0" />
                    <a
                      href={`mailto:${finalConfig.contactInfo.email}`}
                      className="text-white/80 text-sm hover:text-white transition-colors"
                    >
                      {finalConfig.contactInfo.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Footer Sections */}
          {finalConfig.sections?.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-5">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 text-sm hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-white/80 text-sm hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/70 text-sm text-center sm:text-left">
              {finalConfig.copyrightText}
            </p>

            {finalConfig.showLegalLinks && (
              <div className="flex space-x-6">
                <Link
                  href="/privacy"
                  className="text-white/70 text-sm hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-white/70 text-sm hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
