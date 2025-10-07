"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface VideoBackgroundConfig {
  src: string;
  poster: string;
  title?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  overlayColor?: string;
  checkConnection?: boolean;
  loadDelay?: number;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

interface VideoBackgroundProps {
  config: VideoBackgroundConfig;
  className?: string;
  children?: React.ReactNode;
}

export function VideoBackground({
  config,
  className,
  children,
}: VideoBackgroundProps) {
  const {
    src,
    poster,
    title = "Background video",
    overlay = true,
    overlayOpacity = 50,
    overlayColor = "#000000",
    checkConnection = true,
    loadDelay = 1500,
    autoPlay = true,
    loop = true,
    muted = true,
  } = config;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(!checkConnection);

  const shouldLoadVideoBasedOnConnection = useCallback((): boolean => {
    if (typeof window === "undefined") return false;

    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      const { effectiveType, saveData, downlink } = connection;

      if (saveData) return false;
      if (effectiveType === "slow-2g" || effectiveType === "2g") return false;
      if (effectiveType === "3g" && downlink && downlink < 1.5) return false;
      if (downlink && downlink < 1) return false;
    }

    return true;
  }, []);

  useEffect(() => {
    if (!checkConnection) {
      setShouldLoadVideo(true);
      return;
    }

    const canLoadVideo = shouldLoadVideoBasedOnConnection();

    if (canLoadVideo) {
      const timer = setTimeout(() => {
        setShouldLoadVideo(true);
      }, loadDelay);

      return () => clearTimeout(timer);
    }
  }, [checkConnection, loadDelay, shouldLoadVideoBasedOnConnection]);

  useEffect(() => {
    if (!checkConnection) return;

    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (!connection) return;

    const handleConnectionChange = () => {
      const canLoadVideo = shouldLoadVideoBasedOnConnection();
      if (canLoadVideo && !shouldLoadVideo) {
        setShouldLoadVideo(true);
      }
    };

    connection.addEventListener("change", handleConnectionChange);
    return () =>
      connection.removeEventListener("change", handleConnectionChange);
  }, [checkConnection, shouldLoadVideo, shouldLoadVideoBasedOnConnection]);

  const handleCanPlay = useCallback(() => {
    setIsLoaded(true);
    if (videoRef.current && autoPlay) {
      videoRef.current.play().catch((error) => {
        console.error("Video play error:", error);
      });
    }
  }, [autoPlay]);

  useEffect(() => {
    if (!shouldLoadVideo) return;

    const video = videoRef.current;
    if (!video) return;

    video.preload = "metadata";
    video.muted = muted;
    video.loop = loop;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("x5-playsinline", "true");

    video.src = src;
    video.load();

    const handleError = (e: Event) => {
      console.error("Video error:", e);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [shouldLoadVideo, src, loop, muted, handleCanPlay]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background Image (always visible) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${poster})` }}
        aria-label={title}
      />

      {/* Video (conditionally loaded) */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          aria-label={title}
          muted={muted}
          loop={loop}
          playsInline
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity / 100,
          }}
        />
      )}

      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
