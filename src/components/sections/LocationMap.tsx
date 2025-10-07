"use client";

import React from "react";
import Image from "next/image";
import { MapPin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LocationConfig {
  propertyName: string;
  address: {
    line1: string;
    line2?: string;
    reference?: string;
  };
  coordinates?: string;
  mapEmbedUrl: string;
  googleMapsUrl: string;
  image?: {
    src: string;
    alt: string;
  };
  cardPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export interface LocationMapProps {
  title?: string;
  badge?: string;
  config: LocationConfig;
  mapHeight?: {
    mobile?: string;
    desktop?: string;
  };
  className?: string;
}

export function LocationMap({
  title,
  badge,
  config,
  mapHeight = {
    mobile: "350px",
    desktop: "500px",
  },
  className,
}: LocationMapProps) {
  const {
    propertyName,
    address,
    coordinates,
    mapEmbedUrl,
    googleMapsUrl,
    image,
    cardPosition = "top-left",
  } = config;

  const positionClasses = {
    "top-left": "top-6 left-6",
    "top-right": "top-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-right": "bottom-6 right-6",
  };

  return (
    <section id="location" className={cn("py-12 md:py-16 bg-white", className)}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        {(badge || title) && (
          <div className="text-center mb-8 md:mb-12">
            {badge && (
              <div className="flex justify-center mb-4">
                <span className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full text-sm font-semibold">
                  {badge}
                </span>
              </div>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {title}
              </h2>
            )}
          </div>
        )}

        {/* Mobile Info Card */}
        <div className="md:hidden mb-6">
          <LocationCard
            propertyName={propertyName}
            address={address}
            coordinates={coordinates}
            googleMapsUrl={googleMapsUrl}
            image={image}
          />
        </div>

        {/* Map Container */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-xl h-[350px] md:h-[500px]">
          {/* Google Map Embed */}
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
            title={`${propertyName} Location`}
          />

          {/* Desktop Info Card Overlay */}
          <div
            className={cn(
              "hidden md:block absolute z-10 w-[350px]",
              positionClasses[cardPosition]
            )}
          >
            <LocationCard
              propertyName={propertyName}
              address={address}
              coordinates={coordinates}
              googleMapsUrl={googleMapsUrl}
              image={image}
              isOverlay
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface LocationCardProps {
  propertyName: string;
  address: {
    line1: string;
    line2?: string;
    reference?: string;
  };
  coordinates?: string;
  googleMapsUrl: string;
  image?: {
    src: string;
    alt: string;
  };
  isOverlay?: boolean;
}

function LocationCard({
  propertyName,
  address,
  coordinates,
  googleMapsUrl,
  image,
  isOverlay = false,
}: LocationCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg overflow-hidden border border-gray-100",
        isOverlay ? "shadow-xl" : "shadow-md"
      )}
    >
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{propertyName}</h3>

        <div className="flex items-start mb-4">
          <MapPin
            className="text-primary-600 mr-2 flex-shrink-0 mt-0.5"
            size={18}
          />
          <div>
            <p className="text-gray-800 text-sm">{address.line1}</p>
            {address.line2 && (
              <p className="text-gray-800 text-sm">{address.line2}</p>
            )}
            {address.reference && (
              <p className="text-gray-600 text-xs mt-1">{address.reference}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {coordinates && (
            <span className="text-gray-700 font-medium text-sm">
              {coordinates}
            </span>
          )}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors ml-auto"
          >
            Open in Maps
            <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
      </div>

      {image && (
        <div className="relative h-[140px] md:h-[140px] w-full">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="350px"
          />
        </div>
      )}
    </div>
  );
}
