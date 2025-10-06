"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { Phone, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CountryCode {
  code: string;
  dial: string;
  flag: string;
  name: string;
  format?: string;
}

// Popular country codes
export const COUNTRY_CODES: CountryCode[] = [
  {
    code: "US",
    dial: "+1",
    flag: "🇺🇸",
    name: "United States",
    format: "(###) ###-####",
  },
  {
    code: "DO",
    dial: "+1809",
    flag: "🇩🇴",
    name: "Dominican Republic",
    format: "(###) ###-####",
  },
  {
    code: "CA",
    dial: "+1",
    flag: "🇨🇦",
    name: "Canada",
    format: "(###) ###-####",
  },
  {
    code: "MX",
    dial: "+52",
    flag: "🇲🇽",
    name: "Mexico",
    format: "## #### ####",
  },
  {
    code: "GB",
    dial: "+44",
    flag: "🇬🇧",
    name: "United Kingdom",
    format: "#### ######",
  },
  {
    code: "ES",
    dial: "+34",
    flag: "🇪🇸",
    name: "Spain",
    format: "### ## ## ##",
  },
  {
    code: "FR",
    dial: "+33",
    flag: "🇫🇷",
    name: "France",
    format: "# ## ## ## ##",
  },
  {
    code: "DE",
    dial: "+49",
    flag: "🇩🇪",
    name: "Germany",
    format: "### #######",
  },
  {
    code: "IT",
    dial: "+39",
    flag: "🇮🇹",
    name: "Italy",
    format: "### ### ####",
  },
  {
    code: "BR",
    dial: "+55",
    flag: "🇧🇷",
    name: "Brazil",
    format: "(##) #####-####",
  },
  {
    code: "AR",
    dial: "+54",
    flag: "🇦🇷",
    name: "Argentina",
    format: "## ####-####",
  },
  {
    code: "CO",
    dial: "+57",
    flag: "🇨🇴",
    name: "Colombia",
    format: "### ### ####",
  },
  { code: "CL", dial: "+56", flag: "🇨🇱", name: "Chile", format: "# #### ####" },
  { code: "PE", dial: "+51", flag: "🇵🇪", name: "Peru", format: "### ### ###" },
  {
    code: "VE",
    dial: "+58",
    flag: "🇻🇪",
    name: "Venezuela",
    format: "(###) ###-####",
  },
];

export interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onCountryChange?: (country: CountryCode) => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  defaultCountry?: string;
  countries?: CountryCode[];
  id?: string;
  name?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value = "",
      onChange,
      onCountryChange,
      label,
      error,
      helperText,
      placeholder = "Phone number",
      disabled = false,
      fullWidth = false,
      defaultCountry = "US",
      countries = COUNTRY_CODES,
      id,
      name,
    },
    ref
  ) => {
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
      countries.find((c) => c.code === defaultCountry) || countries[0]
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const inputId =
      id || `phone-input-${Math.random().toString(36).substr(2, 9)}`;

    // Parse initial value
    useEffect(() => {
      if (value) {
        const matchedCountry = countries.find((c) => value.startsWith(c.dial));
        if (matchedCountry) {
          setSelectedCountry(matchedCountry);
          setPhoneNumber(value.replace(matchedCountry.dial, "").trim());
        }
      }
    }, [value, countries]);

    const formatPhoneNumber = (input: string, format?: string) => {
      const cleaned = input.replace(/\D/g, "");

      if (!format) return cleaned;

      let formatted = "";
      let digitIndex = 0;

      for (let i = 0; i < format.length && digitIndex < cleaned.length; i++) {
        if (format[i] === "#") {
          formatted += cleaned[digitIndex];
          digitIndex++;
        } else {
          formatted += format[i];
        }
      }

      return formatted;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/\D/g, "");
      const formatted = formatPhoneNumber(input, selectedCountry.format);
      setPhoneNumber(formatted);

      const fullNumber = `${selectedCountry.dial} ${formatted}`.trim();
      onChange?.(fullNumber);
    };

    const handleCountrySelect = (country: CountryCode) => {
      setSelectedCountry(country);
      setIsDropdownOpen(false);
      setSearchQuery("");
      onCountryChange?.(country);

      const fullNumber = `${country.dial} ${phoneNumber}`.trim();
      onChange?.(fullNumber);
    };

    const filteredCountries = countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.dial.includes(searchQuery)
    );

    return (
      <div className={cn("flex flex-col gap-1", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative flex">
          {/* Country Code Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
              disabled={disabled}
              className={cn(
                "flex items-center gap-2 px-3 py-3 bg-gray-50 border rounded-l-md",
                "text-gray-900 font-medium",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10",
                "disabled:bg-gray-100 disabled:cursor-not-allowed",
                "transition-colors duration-200",
                error
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 hover:bg-gray-100",
                "border-r-0"
              )}
            >
              <span className="text-xl">{selectedCountry.flag}</span>
              <span className="text-sm">{selectedCountry.dial}</span>
              <ChevronDown
                size={16}
                className={cn(
                  "text-gray-400 transition-transform duration-200",
                  isDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && !disabled && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-hidden">
                {/* Search */}
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Country List */}
                <div className="overflow-y-auto max-h-64">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 text-left",
                        "hover:bg-gray-50 transition-colors",
                        selectedCountry.code === country.code && "bg-primary-50"
                      )}
                    >
                      <span className="text-xl">{country.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {country.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {country.dial}
                        </div>
                      </div>
                      {selectedCountry.code === country.code && (
                        <svg
                          className="w-4 h-4 text-primary-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}

                  {filteredCountries.length === 0 && (
                    <div className="px-3 py-8 text-center text-sm text-gray-500">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Phone size={18} aria-hidden="true" />
            </div>

            <input
              ref={ref}
              type="tel"
              id={inputId}
              name={name}
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-r-md",
                "text-gray-900 placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500",
                "transition-colors duration-200",
                error
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 hover:bg-gray-100"
              )}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={
                error
                  ? `${inputId}-error`
                  : helperText
                    ? `${inputId}-helper`
                    : undefined
              }
            />
          </div>
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
