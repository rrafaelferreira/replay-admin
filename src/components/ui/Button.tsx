"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "sm";
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className,
  fullWidth,
  disabled,
  target,
  rel,
}: ButtonProps) {
  const base = cn(
    "inline-flex items-center justify-center gap-2 font-semibold transition-all",
    size === "md" && "rounded-[20px] px-6 py-4 text-sm",
    size === "sm" && "rounded-[14px] px-4 py-2.5 text-xs",
    fullWidth && "w-full",
    disabled && "pointer-events-none opacity-50",
    variant === "primary" &&
      "bg-accent text-white shadow-[0_8px_32px_rgba(123,97,255,0.35)] hover:brightness-110 active:scale-[0.98]",
    variant === "secondary" &&
      "neo-card text-foreground hover:brightness-110 active:scale-[0.98]",
    variant === "ghost" && "text-secondary hover:text-foreground",
    variant === "danger" &&
      "bg-danger/10 text-danger hover:bg-danger/15 active:scale-[0.98]",
    className
  );

  const content = (
    <motion.span
      whileTap={{ scale: 0.97 }}
      className="flex items-center justify-center gap-2"
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} className={base} target={target} rel={rel}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={base} disabled={disabled}>
      {content}
    </button>
  );
}
