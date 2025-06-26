
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Custom theming: background color changes based on state
      "peer inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-input",
      // Green when checked, red when not
      "data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600",
      "data-[state=checked]:border-green-600 data-[state=unchecked]:border-red-600",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
        "data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0",
        // Thumb color: green if present, red if absent (border highlight)
        "border-2 data-[state=checked]:border-green-600 data-[state=unchecked]:border-red-600"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
