import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={cn("field", props.className)} />; }
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} className={cn("field min-h-28 resize-y", props.className)} />; }
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} className={cn("field", props.className)} />; }
export function Label({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) { return <label {...props} className={cn("label", props.className)}>{children}</label>; }
