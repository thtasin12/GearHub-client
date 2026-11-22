import { cn } from "@/lib/utils";
export function Card({ className, children }: { className?: string; children: React.ReactNode }) { return <div className={cn("surface card-shadow rounded-2xl", className)}>{children}</div>; }
export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) { return <div className={cn("border-b border-[var(--border)] px-5 py-4", className)}>{children}</div>; }
export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) { return <div className={cn("p-5", className)}>{children}</div>; }
