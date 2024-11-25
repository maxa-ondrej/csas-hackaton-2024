import { cn } from '@/lib/utils';
import React from 'react';

const H1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1
    ref={ref}
    className={cn(
      'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      className,
    )}
    {...props}
  />
));

const H2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      'scroll-m-16 text-3xl font-extrabold tracking-tight lg:text-4xl',
      className,
    )}
    {...props}
  />
));

const H3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'scroll-m-12 text-2xl font-extrabold tracking-tight lg:text-3xl',
      className,
    )}
    {...props}
  />
));

const H4 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      'scroll-m-10 text-xl font-extrabold tracking-tight lg:text-2xl',
      className,
    )}
    {...props}
  />
));

const H5 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      'scroll-m-8 text-lg font-extrabold tracking-tight lg:text-xl',
      className,
    )}
    {...props}
  />
));

const H6 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h6
    ref={ref}
    className={cn(
      'scroll-m-6 text-base font-extrabold tracking-tight lg:text-lg',
      className,
    )}
    {...props}
  />
));

export { H1, H2, H3, H4, H5, H6 };
