"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  delay?: number;
}

export function Card({ children, className, glass, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-[24px] p-5",
        glass ? "glass-card" : "neo-card",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

/** Título padrão de card: ícone roxo + texto (mesmo padrão do painel original). */
export function CardTitle({
  icon: Icon,
  children,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-5 w-5 shrink-0 text-accent" />
      <h2 className="min-w-0 flex-1 truncate font-semibold text-foreground">
        {children}
      </h2>
      {action}
    </div>
  );
}
