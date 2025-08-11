"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface CustomProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "learning" | "level" | "default"
}

const CustomProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CustomProgressProps
>(({ className, value, variant = "default", ...props }, ref) => {
  const getGradientClass = () => {
    switch (variant) {
      case "learning":
        return "bg-gradient-to-r from-orange-500 via-yellow-400 via-yellow-300 to-yellow-200"
      case "level":
        return "bg-gradient-to-r from-purple-500 via-pink-400 via-pink-300 to-pink-200"
      default:
        return "bg-gradient-to-r from-blue-800 via-blue-600 via-blue-400 to-cyan-300"
    }
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-black",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 transition-all", getGradientClass())}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
CustomProgress.displayName = ProgressPrimitive.Root.displayName

export { CustomProgress } 