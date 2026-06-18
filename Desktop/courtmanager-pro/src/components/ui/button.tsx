import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-orange-500 text-white hover:bg-orange-600 shadow-sm",
          variant === "destructive" && "bg-red-500 text-white hover:bg-red-600",
          variant === "outline" && "border border-slate-200 bg-transparent hover:bg-slate-100 hover:text-slate-900",
          variant === "secondary" && "bg-slate-100 text-slate-900 hover:bg-slate-200",
          variant === "ghost" && "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800",
          variant === "link" && "text-slate-900 underline-offset-4 hover:underline",
          size === "default" && "h-9 px-4 py-2",
          size === "sm" && "h-8 rounded-md px-3 text-xs",
          size === "lg" && "h-10 rounded-md px-8",
          size === "icon" && "h-9 w-9",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
