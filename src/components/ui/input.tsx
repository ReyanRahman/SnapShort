import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#111111] shadow-sm outline-none transition placeholder:text-[#7b7b7b] focus:border-[#ff6a3d] focus:ring-2 focus:ring-[#ff6a3d]/20",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";
