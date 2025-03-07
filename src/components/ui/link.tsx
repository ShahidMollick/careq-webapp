import React from "react";
import { cn } from "@/lib/utils";
import NextLink from "next/link";

interface LinkProps extends React.ComponentPropsWithoutRef<typeof NextLink> {
  className?: string;
  href: string;
  external?: boolean;
  children: React.ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, external, children, ...props }, ref) => {
    if (external) {
      return (
        <a
          ref={ref}
          href={href}
          className={cn(
            "text-primary hover:text-primary/80 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
            className
          )}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <NextLink
        ref={ref}
        href={href}
        className={cn(
          "text-primary hover:text-primary/80 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
          className
        )}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
);

Link.displayName = "Link";

export default Link;
