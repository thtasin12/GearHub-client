
"use client"

import * as React from "react"
import Link from "next/link"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--orange)]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--orange)] text-white hover:bg-[var(--orange-strong)] shadow-[0_8px_20px_rgba(244,119,50,.22)]",

        primary:
          "bg-[var(--orange)] text-white hover:bg-[var(--orange-strong)] shadow-[0_8px_20px_rgba(244,119,50,.22)]",

        secondary:
          "bg-[var(--orange-soft)] text-[var(--orange)] hover:brightness-95",

        outline:
          "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-muted)]",

        ghost:
          "bg-transparent text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",

        destructive:
          "bg-red-600 text-white hover:bg-red-700",

        danger:
          "bg-red-600 text-white hover:bg-red-700",

        navy:
          "bg-[#14243c] text-white hover:bg-[#203653] dark:bg-[#243b5c]",

        link:
          "text-[var(--orange)] underline-offset-4 hover:underline"
      },

      size: {
        default: "h-11 px-4 text-sm",
        xs: "h-7 rounded-md px-2 text-xs",
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-6 text-sm",

        icon: "size-10 p-0",
        "icon-xs": "size-7 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-11 p-0"
      }
    },

    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
)

type ButtonStyleProps = VariantProps<typeof buttonVariants>

type NativeButtonProps = Omit<
  ButtonPrimitive.Props,
  "className" | "children"
> &
  ButtonStyleProps & {
    className?: string
    children?: React.ReactNode
  }

type LinkButtonProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className"
> &
  ButtonStyleProps & {
    href: string
    className?: string
  }

export type ButtonProps = NativeButtonProps | LinkButtonProps

export function Button(props: LinkButtonProps): React.ReactElement

export function Button(props: NativeButtonProps): React.ReactElement

export function Button(
  props: LinkButtonProps | NativeButtonProps
): React.ReactElement {
  const linkProps = props as LinkButtonProps

  if (typeof linkProps.href === "string") {
    const {
      href,
      variant = "primary",
      size = "md",
      className,
      children,
      ...anchorProps
    } = linkProps

    return (
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant, size }),
          className
        )}
        {...anchorProps}
      >
        {children}
      </Link>
    )
  }

  const {
    variant = "primary",
    size = "md",
    className,
    ...buttonProps
  } = props as NativeButtonProps

  return (
    <ButtonPrimitive
      {...buttonProps}
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size }),
        className
      )}
    />
  )
}

export { buttonVariants }
