import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-3xl border border-black/10 bg-white px-4 py-3 text-sm text-[#111111] shadow-sm outline-none transition placeholder:text-[#7b7b7b] focus:border-[#ff6a3d] focus:ring-2 focus:ring-[#ff6a3d]/20",
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
