"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/forms/Button";

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface HeaderConfig {
  logo: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    href?: string;
  };
  navItems: NavItem[];
  ctaButton?: {
    label: string;
    href: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    icon?: React.ReactNode;
  };
  sticky?: boolean;
  transparent?: boolean;
  darkMode?: boolean;
  maxWidth?: string;
}

interface HeaderProps {
  config: HeaderConfig;
  className?: string;
  onNavClick?: (href: string, e: React.MouseEvent) => void;
}

export function Header({ config, className, onNavClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const {
    logo,
    navItems,
    ctaButton,
    sticky = true,
    transparent = false,
    darkMode = false,
    maxWidth = "1300px",
  } = config;

  // Handle scroll for sticky header
  useEffect(() => {
    if (!sticky && !transparent) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sticky, transparent]);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const handleNavItemClick = (
    href: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (onNavClick) {
      onNavClick(href, e);
    }
    setMobileMenuOpen(false);
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ctaButton?.onClick) {
      ctaButton.onClick(e);
    }
    setMobileMenuOpen(false);
  };

  const headerClasses = cn(
    "w-full z-50 transition-all duration-300",
    sticky && "sticky top-0",
    transparent && !scrolled ? "bg-transparent" : "bg-white shadow-md",
    className
  );

  const textColor =
    darkMode || (transparent && !scrolled) ? "text-white" : "text-gray-800";

  return (
    <header className={headerClasses}>
      <div className="py-4">
        <div className="mx-auto px-4 sm:px-6" style={{ maxWidth }}>
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href={logo.href || "/"}
              className="flex items-center flex-shrink-0"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width || 160}
                height={logo.height || 64}
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center justify-center space-x-2 lg:space-x-8 flex-1">
              {navItems.map((item) => (
                <div key={item.href} className="relative group">
                  <a
                    href={item.href}
                    onClick={(e) => handleNavItemClick(item.href, e)}
                    className={cn(
                      "text-base font-semibold transition-colors px-2 py-1",
                      "hover:text-primary-600",
                      textColor
                    )}
                  >
                    {item.label}
                  </a>

                  {/* Dropdown menu for children */}
                  {item.children && item.children.length > 0 && (
                    <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        {item.children.map((child) => (
                          <a
                            key={child.href}
                            href={child.href}
                            onClick={(e) => handleNavItemClick(child.href, e)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop CTA Button */}
            {ctaButton && (
              <div className="hidden md:block">
                <Button
                  onClick={handleCtaClick}
                  variant="primary"
                  size="md"
                  leftIcon={ctaButton.icon}
                >
                  {ctaButton.label}
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn("md:hidden z-50", textColor)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[84px] bg-white z-40 md:hidden animate-fade-in"
          style={{
            animation: "fadeIn 0.2s ease-in-out forwards",
          }}
        >
          <div className="overflow-y-auto h-full">
            <nav className="flex flex-col">
              {navItems.map((item, index) => (
                <React.Fragment key={item.href}>
                  <div>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavItemClick(item.href, e)}
                      className="flex items-center justify-between px-6 py-4 text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      <span>{item.label}</span>
                      {item.children && item.children.length > 0 && (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </a>

                    {/* Mobile submenu */}
                    {item.children && item.children.length > 0 && (
                      <div className="bg-gray-50">
                        {item.children.map((child) => (
                          <a
                            key={child.href}
                            href={child.href}
                            onClick={(e) => handleNavItemClick(child.href, e)}
                            className="block px-8 py-3 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {index < navItems.length - 1 && (
                    <div className="h-px bg-gray-200" />
                  )}
                </React.Fragment>
              ))}

              {/* Mobile CTA Button */}
              {ctaButton && (
                <div className="px-6 py-6 border-t border-gray-200">
                  <Button
                    onClick={handleCtaClick}
                    variant="primary"
                    size="lg"
                    fullWidth
                    leftIcon={ctaButton.icon}
                  >
                    {ctaButton.label}
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
