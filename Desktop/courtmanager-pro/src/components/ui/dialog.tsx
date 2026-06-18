import * as React from "react"
import { cn } from "@/lib/utils"

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" 
        onClick={() => onOpenChange(false)}
      />
      {/* Dialog Wrapper */}
      {children}
    </div>
  )
}

export function DialogContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative z-10 grid w-full max-w-lg gap-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg duration-200 rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-bold leading-none tracking-tight text-slate-900 dark:text-slate-100", className)} {...props} />
}
