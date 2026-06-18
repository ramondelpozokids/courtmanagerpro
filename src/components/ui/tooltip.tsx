import * as React from "react"
import { cn } from "@/lib/utils"

export function TooltipProvider({ children, delayDuration }: { children: React.ReactNode, delayDuration?: number }) {
  return <>{children}</>
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="relative group inline-block">{children}</div>
}

export function TooltipTrigger({ children, asChild, ...props }: { children: React.ReactNode, asChild?: boolean }) {
  return <div {...props}>{children}</div>
}

export function TooltipContent({ className, children, side = "top", ...props }: React.HTMLAttributes<HTMLDivElement> & { side?: "top" | "bottom" | "left" | "right" }) {
  return (
    <div
      className={cn(
        "absolute z-50 overflow-hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs text-slate-50 shadow-md animate-in fade-in-0 zoom-in-95 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap",
        side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
        side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-1.5",
        side === "left" && "right-full top-1/2 -translate-y-1/2 mr-1.5",
        side === "right" && "left-full top-1/2 -translate-y-1/2 ml-1.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
