import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // ScaleLens custom variants
        hero: "bg-gradient-hero text-primary-foreground shadow-glow hover:shadow-elegant transition-all duration-300 hover:scale-105 font-semibold",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-card",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-card",
        elegant: "bg-gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow transition-all duration-300",
  glass: "bg-background/80 backdrop-blur-sm border border-gray-200/50 hover:bg-background/90 text-foreground shadow-card",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);