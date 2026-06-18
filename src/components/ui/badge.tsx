import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default" && "border-transparent bg-orange-500 text-white hover:bg-orange-600",
        variant === "secondary" && "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
        variant === "destructive" && "border-transparent bg-red-500 text-white hover:bg-red-650",
        variant === "outline" && "text-slate-950 border-slate-200",
        className
      )}
      {...props}
    />
  )
}
