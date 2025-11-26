import React, { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
        secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:ring-secondary-500',
        accent: 'bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-400',
        outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500',
        destructive: 'bg-error-500 text-white hover:bg-error-600 focus-visible:ring-error-400',
        success: 'bg-success-500 text-white hover:bg-success-600 focus-visible:ring-success-400',
      },
      size: {
        xs: 'h-8 px-2.5 text-xs',
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-5',
        xl: 'h-12 px-6 text-base',
      },
      fullWidth: {
        true: 'w-full',
      },
      iconOnly: {
        true: 'p-0 aspect-square',
      },
    },
    compoundVariants: [
      {
        iconOnly: true,
        size: 'xs',
        class: 'w-8',
      },
      {
        iconOnly: true,
        size: 'sm',
        class: 'w-9',
      },
      {
        iconOnly: true,
        size: 'md',
        class: 'w-10',
      },
      {
        iconOnly: true,
        size: 'lg',
        class: 'w-11',
      },
      {
        iconOnly: true,
        size: 'xl',
        class: 'w-12',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      fullWidth: false,
      iconOnly: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      iconOnly,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, iconOnly, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };