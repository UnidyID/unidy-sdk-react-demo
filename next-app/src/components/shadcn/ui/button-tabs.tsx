'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/components/shadcn/utils';
import { ComponentProps, FC, PropsWithChildren } from 'react';

const ButtonTabs: FC<ComponentProps<typeof TabsPrimitive.Root>> = ({
	className,
	...props
}) => {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			className={cn('flex flex-col gap-2', className)}
			{...props}
		/>
	);
};

const ButtonTabsList: FC<ComponentProps<typeof TabsPrimitive.List>> = ({
	className,
	...props
}) => {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn('flex flex-row gap-2', className)}
			{...props}
		/>
	);
};

const ButtonTabsGroup: FC<PropsWithChildren & { className?: string }> = ({
	children,
	className,
	...props
}) => {
	return (
		<div
			className={cn('flex flex-row p-1 bg-neutral-weak rounded-lg', className)}
			{...props}
		>
			{children}
		</div>
	);
};

const ButtonTabsTrigger: FC<ComponentProps<typeof TabsPrimitive.Trigger>> = ({
	className,
	...props
}) => {
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(
				"data-[state=active]:bg-section focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring data-[state=active]:text-neutral text-neutral-strong inline-flex h-8 flex-1 items-center justify-center rounded-md px-3 py-1 button-md whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}
		/>
	);
};

const ButtonTabsContent: FC<ComponentProps<typeof TabsPrimitive.Content>> = ({
	className,
	...props
}) => {
	return (
		<TabsPrimitive.Content
			data-slot="tabs-content"
			className={cn('flex-1 outline-none', className)}
			{...props}
		/>
	);
};

export {
	ButtonTabs,
	ButtonTabsContent,
	ButtonTabsGroup,
	ButtonTabsList,
	ButtonTabsTrigger
};
