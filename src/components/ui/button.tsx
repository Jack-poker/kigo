import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground transform hover:scale-[1.02] active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  children?: React.ReactNode;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingText,
  children,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const Comp = asChild ? Slot.Root : "button";

  // Enhanced click handler that detects async operations
  const handleClick = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || isProcessing || disabled) return;

      if (onClick) {
        try {
          setIsProcessing(true);
          const result = onClick(event);

          // Check if the result is a Promise
          if (result && typeof result.then === "function") {
            await result;
          }
        } catch (error) {
          console.error("Button click error:", error);
        } finally {
          setIsProcessing(false);
        }
      }
    },
    [onClick, loading, isProcessing, disabled],
  );

  const isLoading = loading || isProcessing;
  const displayText = isLoading && loadingText ? loadingText : children;

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size }),
        isLoading && "cursor-not-allowed",
        className,
      )}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
      data-oid="rvzpyt1"
    >
      {/* Loading spinner */}
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin" data-oid="rqkon7v" />
      )}

      {/* Button content with loading state */}
      <span
        className={cn(
          "flex items-center gap-2 transition-opacity duration-200",
          isLoading && !loadingText && "opacity-70",
        )}
        data-oid="1:znjba"
      >
        {displayText}
      </span>

      {/* Loading overlay effect */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-current opacity-10 animate-pulse"
          data-oid="t.503et"
        />
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
