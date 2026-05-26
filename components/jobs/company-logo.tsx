"use client";

import Image from "next/image";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type CompanyLogoProps = {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-12 w-12 text-sm",
  md: "h-16 w-16 text-lg",
  lg: "h-20 w-20 text-xl"
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "V";
}

export function CompanyLogo({ src, name, size = "sm", className }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500 via-sky-500 to-coral font-black text-white shadow-card ring-1 ring-white/50 dark:ring-white/10",
        sizeClasses[size],
        className
      )}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={`${name} logo`}
          fill
          sizes={size === "lg" ? "80px" : size === "md" ? "64px" : "48px"}
          className="bg-white object-contain p-2"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="flex items-center gap-1">
          {initials(name)}
          <ShieldCheck className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
}
