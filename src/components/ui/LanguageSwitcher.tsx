"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Language {
  code: string;
  name: string;
  flag?: string;
}

interface LanguageSwitcherProps {
  languages: Language[];
  currentLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  variant?: "default" | "minimal";
  position?: "left" | "right";
  showFlag?: boolean;
  className?: string;
}

export function LanguageSwitcher({
  languages,
  currentLanguage,
  onLanguageChange,
  variant = "default",
  position = "right",
  showFlag = true,
  className,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((lang) => lang.code === currentLanguage);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center transition-colors focus:outline-none rounded-full",
          variant === "minimal" && isMobile
            ? "justify-center p-1.5 hover:bg-gray-100"
            : "px-3 py-2 hover:bg-gray-100 bg-gray-50"
        )}
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <Globe size={16} className="text-gray-600" />
        {(!isMobile || variant !== "minimal") && currentLang && (
          <>
            <span className="text-sm font-medium mx-2">
              {currentLang.code.toUpperCase()}
            </span>
            <ChevronDown
              size={14}
              className={cn(
                "text-gray-500 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </>
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute mt-2 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100",
            position === "right" ? "right-0" : "left-0",
            isMobile ? "w-32" : "w-40"
          )}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm transition-colors",
                "hover:bg-gray-50",
                currentLanguage === lang.code
                  ? "bg-gray-50 text-gray-900"
                  : "text-gray-700"
              )}
            >
              <div className="flex items-center gap-2">
                {showFlag && lang.flag && (
                  <span className="text-lg">{lang.flag}</span>
                )}
                <span>{lang.name}</span>
              </div>
              {currentLanguage === lang.code && (
                <Check size={14} className="text-primary-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
