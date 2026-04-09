import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-black/8 bg-white shadow-[0_18px_80px_-36px_rgba(17,17,17,0.3)]",
        className,
      )}
      {...props}
    />
  );
}
