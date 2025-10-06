"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  disablePast?: boolean;
  disableSundays?: boolean;
  disableWeekends?: boolean;
  minDate?: Date;
  maxDate?: Date;
  fullWidth?: boolean;
  id?: string;
  name?: string;
}

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  disablePast?: boolean;
  disableSundays?: boolean;
  disableWeekends?: boolean;
  minDate?: Date;
  maxDate?: Date;
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
}

function SimpleCalendar({
  selectedDate,
  onDateSelect,
  disablePast = true,
  disableSundays = false,
  disableWeekends = false,
  minDate,
  maxDate,
  currentMonth,
  currentYear,
  onMonthChange,
}: CalendarProps) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handleDayClick = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);

    if (isDisabled(day)) return;

    onDateSelect(date);
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      onMonthChange(11, currentYear - 1);
    } else {
      onMonthChange(currentMonth - 1, currentYear);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      onMonthChange(0, currentYear + 1);
    } else {
      onMonthChange(currentMonth + 1, currentYear);
    }
  };

  const canGoPrevious = () => {
    if (minDate) {
      const firstOfCurrentMonth = new Date(currentYear, currentMonth, 1);
      firstOfCurrentMonth.setHours(0, 0, 0, 0);
      return firstOfCurrentMonth > minDate;
    }
    if (disablePast) {
      return (
        currentYear > now.getFullYear() ||
        (currentYear === now.getFullYear() && currentMonth > now.getMonth())
      );
    }
    return true;
  };

  const canGoNext = () => {
    if (maxDate) {
      const lastOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0);
      lastOfCurrentMonth.setHours(0, 0, 0, 0);
      return lastOfCurrentMonth < maxDate;
    }
    return true;
  };

  const isToday = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === now.getTime();
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return date.getTime() === selected.getTime();
  };

  const isDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);

    if (disablePast && date < now) return true;

    const dayOfWeek = date.getDay();
    if (disableSundays && dayOfWeek === 0) return true;
    if (disableWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) return true;

    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }

    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (date > max) return true;
    }

    return false;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious()}
          className="p-2 hover:bg-gray-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>

        <span className="font-semibold text-gray-900">
          {monthNames[currentMonth]} {currentYear}
        </span>

        <button
          type="button"
          onClick={goToNextMonth}
          disabled={!canGoNext()}
          className="p-2 hover:bg-gray-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => (
          <button
            key={index}
            type="button"
            onClick={() => day && handleDayClick(day)}
            disabled={!day || isDisabled(day)}
            className={cn(
              "aspect-square p-2 text-sm rounded-md transition-all duration-150",
              "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500",
              !day && "invisible",
              day &&
                isToday(day) &&
                !isSelected(day) &&
                "font-bold text-primary-600 bg-primary-50",
              day &&
                isSelected(day) &&
                "bg-primary-600 text-white hover:bg-primary-700 font-semibold",
              day &&
                isDisabled(day) &&
                "text-gray-300 cursor-not-allowed hover:bg-transparent opacity-50",
              day &&
                !isDisabled(day) &&
                !isSelected(day) &&
                !isToday(day) &&
                "text-gray-700"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Footer with helper text */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500 text-center">
        {disablePast && "Past dates are disabled"}
        {disableSundays && !disableWeekends && " • Sundays disabled"}
        {disableWeekends && " • Weekends disabled"}
      </div>
    </div>
  );
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      label,
      error,
      helperText,
      placeholder = "Select a date",
      disabled = false,
      disablePast = true,
      disableSundays = false,
      disableWeekends = false,
      minDate,
      maxDate,
      fullWidth = false,
      id,
      name,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(
      value?.getMonth() || new Date().getMonth()
    );
    const [currentYear, setCurrentYear] = useState(
      value?.getFullYear() || new Date().getFullYear()
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const pickerId =
      id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const formatDateForDisplay = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const handleDateSelect = (date: Date) => {
      onChange(date);
      setIsOpen(false);
    };

    const handleMonthChange = (month: number, year: number) => {
      setCurrentMonth(month);
      setCurrentYear(year);
    };

    return (
      <div
        className={cn("flex flex-col gap-1", fullWidth && "w-full")}
        ref={containerRef}
      >
        {label && (
          <label
            htmlFor={pickerId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 z-10">
            <Calendar size={18} aria-hidden="true" />
          </div>

          <button
            type="button"
            id={pickerId}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              "w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-md text-left",
              "text-gray-900",
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
                ? `${pickerId}-error`
                : helperText
                  ? `${pickerId}-helper`
                  : undefined
            }
          >
            <span className={cn(!value && "text-gray-400")}>
              {value ? formatDateForDisplay(value) : placeholder}
            </span>
          </button>

          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown
              size={18}
              className={cn(
                "text-gray-400 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </div>

          <input
            type="hidden"
            ref={ref}
            name={name}
            value={value ? value.toISOString().split("T")[0] : ""}
          />
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1">
            <SimpleCalendar
              selectedDate={value}
              onDateSelect={handleDateSelect}
              disablePast={disablePast}
              disableSundays={disableSundays}
              disableWeekends={disableWeekends}
              minDate={minDate}
              maxDate={maxDate}
              currentMonth={currentMonth}
              currentYear={currentYear}
              onMonthChange={handleMonthChange}
            />
          </div>
        )}

        {error && (
          <p
            id={`${pickerId}-error`}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${pickerId}-helper`} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
