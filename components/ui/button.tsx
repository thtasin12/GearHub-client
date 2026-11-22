import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "navy";
type BaseProps = { variant?: Variant; size?: "sm" | "md" | "lg"; className?: string; children: ReactNode };
type ButtonProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "size"> & { href?: never };
type LinkProps = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & { href: string };
const styles: Record<Variant, string> = { primary: "bg-[var(--orange)] text-white hover:bg-[var(--orange-strong)] shadow-[0_8px_20px_rgba(244,119,50,.22)]", secondary: "bg-[var(--orange-soft)] text-[var(--orange)] hover:brightness-95", outline: "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-muted)]", ghost: "bg-transparent text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]", danger: "bg-red-600 text-white hover:bg-red-700", navy: "bg-[#14243c] text-white hover:bg-[#203653] dark:bg-[#243b5c]" };
const sizes = { sm: "h-9 px-3 text-xs", md: "h-11 px-4 text-sm", lg: "h-12 px-6 text-sm" };
export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const classes = cn("inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50", styles[variant], sizes[size], className);
  if ("href" in props && props.href) return <Link href={props.href} className={classes} {...(rest as LinkProps)}>{children}</Link>;
  return <button className={classes} {...(rest as ButtonProps)}>{children}</button>;
}
