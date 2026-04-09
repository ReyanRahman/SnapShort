import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  children,
}: {
  className?: string;
  tone?: "neutral" | "success" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const styles = {
    neutral: "bg-black/[0.05] text-[#111111]",
    success: "bg-[#ebfff3] text-[#0d7a41]",
    warning: "bg-[#fff8e6] text-[#9b6a08]",
    danger: "bg-[#fff0ea] text-[#b93810]",
  };

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", styles[tone], className)}>
      {children}
    </span>
  );
}
