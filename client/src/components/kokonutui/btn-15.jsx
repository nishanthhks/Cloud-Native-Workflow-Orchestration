import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export default function Btn15({
  className,
  label = "Explore Components",
  ...props
}) {
  return (
    <Button
      className={cn(
        "relative h-10 px-4 overflow-hidden",
        "bg-zinc-900 text-white", // Enforce dark mode colors
        "transition-all duration-200",
        "group",
        className
      )}
      {...props}
    >
      {/* Gradient background effect */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
          "opacity-40 group-hover:opacity-80",
          "blur-[1px] transition-opacity duration-500"
        )}
      />
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span className="text-white">{label}</span>
        {/* <ArrowUpRight className="w-3.5 h-3.5 text-white/90" /> */}
      </div>
    </Button>
  );
}
