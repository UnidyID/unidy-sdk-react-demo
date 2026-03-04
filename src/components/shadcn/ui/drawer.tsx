'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/components/shadcn/utils';

const Drawer = ({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => {
	return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
};

const DrawerTrigger = ({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) => {
	return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
};

const DrawerPortal = ({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) => {
	return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
};

const DrawerClose = ({
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) => {
	return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
};

const DrawerOverlay = ({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) => {
	return (
		<DrawerPrimitive.Overlay
			data-slot="drawer-overlay"
			className={cn('fixed inset-0 z-100 bg-overlay', className)}
			{...props}
		/>
	);
};

const DrawerContent = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) => {
	return (
		<DrawerPortal data-slot="drawer-portal">
			<DrawerOverlay />
			<DrawerPrimitive.Content
				data-slot="drawer-content"
				className={cn(
					'group/drawer-content bg-foreground backdrop-blur-sm fixed z-100 flex h-auto flex-col',
					'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[calc(100vh-120px)] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=top]:border-neutral-weak',
					'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-10 data-[vaul-drawer-direction=bottom]:max-h-[calc(100vh-120px)] data-[vaul-drawer-direction=bottom]:rounded-t-[16px] data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=bottom]:border-neutral-weak',
					'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:border-neutral-weak data-[vaul-drawer-direction=right]:sm:max-w-sm',
					'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:border-neutral-weak data-[vaul-drawer-direction=left]:sm:max-w-sm',
					className
				)}
				{...props}
			>
				<div className="absolute -top-3 left-1/2 -translate-x-1/2 h-1 w-[120px] rounded-full bg-section/50 shrink-0 group-data-[vaul-drawer-direction=bottom]/drawer-content:block hidden" />
				<div className="overflow-y-scroll scrollbar-hidden">{children}</div>
			</DrawerPrimitive.Content>
		</DrawerPortal>
	);
};

const DrawerHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
	return (
		<div
			data-slot="drawer-header"
			className={cn(
				'grid gap-1.5 text-center sm:text-left bg-section py-6 px-6 mb-6',
				className
			)}
			{...props}
		/>
	);
};

const DrawerFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
	return (
		<div
			data-slot="drawer-footer"
			className={cn('flex flex-col gap-2 py-6 px-6 bg-section mt-6', className)}
			{...props}
		/>
	);
};

const DrawerTitle = ({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) => {
	return (
		<DrawerPrimitive.Title
			data-slot="drawer-title"
			className={cn('title-2 text-neutral', className)}
			{...props}
		/>
	);
};

const DrawerDescription = ({
	className,
	...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) => {
	return (
		<DrawerPrimitive.Description
			data-slot="drawer-description"
			className={cn('body-2 text-neutral-strong', className)}
			{...props}
		/>
	);
};

export {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger
};
