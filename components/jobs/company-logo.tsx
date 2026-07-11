"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type CompanyLogoProps = {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-12 w-12 text-sm",
  md: "h-16 w-16 text-lg",
  lg: "h-20 w-20 text-xl"
};

const companyMarks: Record<string, { mark: string; background: string; foreground?: string }> = {
  "Tata Consultancy Services": { mark: "TCS", background: "bg-[#1f3f95]" },
  Infosys: { mark: "infosys", background: "bg-white", foreground: "text-[#007cc3]" },
  Microsoft: { mark: "MS", background: "bg-white", foreground: "text-[#107c10]" },
  Google: { mark: "G", background: "bg-white", foreground: "text-[#4285f4]" },
  Accenture: { mark: ">", background: "bg-[#a100ff]" },
  Wipro: { mark: "W", background: "bg-[#552583]" },
  HCLTech: { mark: "HCL", background: "bg-[#006bb6]" },
  IBM: { mark: "IBM", background: "bg-[#0f62fe]" },
  "Amazon Jobs": { mark: "amazon", background: "bg-[#131a22]", foreground: "text-[#ff9900]" },
  Deloitte: { mark: "D.", background: "bg-[#86bc25]", foreground: "text-[#111827]" },
  Capgemini: { mark: "C", background: "bg-[#0070ad]" },
  Oracle: { mark: "ORACLE", background: "bg-[#f80000]" },
  "State Bank of India": { mark: "SBI", background: "bg-[#193a8a]" },
  "Union Public Service Commission": { mark: "UPSC", background: "bg-[#8b5e34]" },
  "Reserve Bank of India": { mark: "RBI", background: "bg-[#7b4f19]" },
  "Indian Space Research Organisation": { mark: "ISRO", background: "bg-[#0d559b]" },
  "Defense Research and Development Organisation": { mark: "DRDO", background: "bg-[#254c35]" },
  "Staff Selection Commission": { mark: "SSC", background: "bg-[#7c2d12]" },
  Cognizant: { mark: "cognizant", background: "bg-[#0033a0]" },
  "Tata Steel": { mark: "TATA", background: "bg-[#0c3b70]" }
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "V";
}

export function CompanyLogo({ name, size = "sm", className }: CompanyLogoProps) {
  const brand = companyMarks[name];
  const mark = brand?.mark ?? initials(name);

  if (name === "Microsoft") {
    return (
      <div className={cn("grid shrink-0 grid-cols-2 gap-1 rounded-lg bg-white p-2 shadow-card ring-1 ring-white/50 dark:ring-white/10", sizeClasses[size], className)} aria-label="Microsoft logo" role="img">
        <span className="bg-[#f25022]" /><span className="bg-[#7fba00]" /><span className="bg-[#00a4ef]" /><span className="bg-[#ffb900]" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg font-black shadow-card ring-1 ring-white/50 dark:ring-white/10",
        brand?.background ?? "bg-gradient-to-br from-emerald-500 via-sky-500 to-coral",
        brand?.foreground ?? "text-white",
        sizeClasses[size],
        className
      )}
      aria-label={`${name} logo`}
      role="img"
    >
      <span className={cn("flex items-center gap-1 leading-none", mark.length > 5 ? "text-[10px]" : mark.length > 3 ? "text-xs" : "text-sm")}>{mark}{!brand && <ShieldCheck className="h-3.5 w-3.5" />}</span>
    </div>
  );
}
