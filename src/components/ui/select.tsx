import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-[#111111] shadow-sm outline-none transition focus:border-[#ff6a3d] focus:ring-2 focus:ring-[#ff6a3d]/20",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
