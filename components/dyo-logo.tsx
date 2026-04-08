"use client"

import { cn } from "@/lib/utils"

interface DyoLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
}

const sizeMap = {
  sm: { icon: "h-8 w-8", text: "text-xl", letter: "text-lg" },
  md: { icon: "h-10 w-10", text: "text-2xl", letter: "text-xl" },
  lg: { icon: "h-12 w-12", text: "text-3xl", letter: "text-2xl" },
  xl: { icon: "h-16 w-16", text: "text-4xl", letter: "text-3xl" },
}

export function DyoLogo({ size = "md", showText = true, className }: DyoLogoProps) {
  const sizes = sizeMap[size]

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-xl bg-primary",
        sizes.icon
      )}>
        <span className={cn("font-bold text-primary-foreground", sizes.letter)}>
          ɖ
        </span>
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight gradient-text", sizes.text)}>
          ɖyɔ̌
        </span>
      )}
    </div>
  )
}
