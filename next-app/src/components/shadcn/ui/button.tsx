import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/components/shadcn/utils';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 clickable',
	{
		variants: {
			variant: {
				solid:
					'border border-transparent bg-theme text-theme-contrast shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.1)] hover:bg-theme-strong active:bg-theme-strong',
				'solid-weak':
					'border border-transparent bg-theme-weak text-theme hover:bg-theme-medium active:bg-theme-medium',
				outline:
					'border border-theme bg-transparent text-theme shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.1)] hover:bg-theme-weak active:bg-theme-medium',
				'outline-weak':
					'border border-theme-medium bg-transparent text-theme hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.1)] hover:bg-theme-weak active:bg-theme-medium',
				ghost:
					'border border-transparent bg-transparent text-theme hover:bg-theme-weak active:bg-theme-medium',
				'ghost-weak':
					'border border-transparent bg-transparent text-theme-medium hover:bg-theme-weak active:bg-theme-medium',
				link: 'text-theme underline-offset-4 hover:underline'
			},
			size: {
				sm: 'h-8 px-3 rounded-[10px] button-sm gap-1.5 [&_svg]:size-3.5',
				md: 'h-10 px-4 rounded-[10px] button-md [&_svg]:size-4',
				lg: 'h-[52px] px-6 rounded-[12px] button-lg [&_svg]:size-6',
				xs: 'h-6 px-3 rounded-[8px] button-sm [&_svg]:size-3',
				link: 'button-md [&_svg]:size-4'
			},
			iconOnly: {
				true: '',
				false: ''
			}
		},
		compoundVariants: [
			{
				iconOnly: true,
				size: 'sm',
				className: 'size-6'
			},
			{
				iconOnly: true,
				size: 'md',
				className: 'size-10'
			},
			{
				iconOnly: true,
				size: 'lg',
				className: 'size-[52px]'
			},
			{
				iconOnly: true,
				size: 'xs',
				className: 'size-6'
			}
		]
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	theme?:
		| 'accent'
		| 'accent-contrast'
		| 'neutral'
		| 'danger'
		| 'info'
		| 'warning'
		| 'success'
		| 'sdk';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = 'solid',
			size = 'md',
			iconOnly = false,
			asChild = false,
			theme = 'neutral',
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button';
		const themeClass = `theme-${theme}`;

		return (
			<Comp
				className={cn(
					themeClass,
					buttonVariants({ variant, size, iconOnly, className })
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
