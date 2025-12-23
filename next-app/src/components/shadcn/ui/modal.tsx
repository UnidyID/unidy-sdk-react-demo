'use client';

import * as React from 'react';

import * as ModalPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/components/shadcn/utils';
import { X } from 'lucide-react';
import { type FC } from 'react';
import { Button } from './button';

const Modal: FC<React.ComponentProps<typeof ModalPrimitive.Root>> = ({
	...props
}) => {
	return <ModalPrimitive.Root data-slot="modal" {...props} />;
};

const ModalTrigger: FC<React.ComponentProps<typeof ModalPrimitive.Trigger>> = ({
	...props
}) => {
	return <ModalPrimitive.Trigger data-slot="modal-trigger" {...props} />;
};

const ModalPortal: FC<React.ComponentProps<typeof ModalPrimitive.Portal>> = ({
	...props
}) => {
	return <ModalPrimitive.Portal data-slot="modal-portal" {...props} />;
};

const ModalClose: FC<React.ComponentProps<typeof ModalPrimitive.Close>> = ({
	...props
}) => {
	return <ModalPrimitive.Close data-slot="modal-close" {...props} />;
};

const ModalOverlay: FC<React.ComponentProps<typeof ModalPrimitive.Overlay>> = ({
	className,
	...props
}) => {
	return (
		<ModalPrimitive.Overlay
			data-slot="modal-overlay"
			className={cn(
				'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-overlay',
				className
			)}
			{...props}
		/>
	);
};

const ModalContent: FC<React.ComponentProps<typeof ModalPrimitive.Content>> = ({
	className,
	children,
	...props
}) => {
	return (
		<ModalPortal data-slot="modal-portal">
			<ModalOverlay />
			<ModalPrimitive.Content
				data-slot="modal-content"
				className={cn(
					'bg-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[800px] translate-x-[-50%] translate-y-[-50%] border border-neutral-weak backdrop-blur-sm shadow-lg duration-200 sm:rounded-xl max-h-[80vh] overflow-y-auto scrollbar-hidden',
					className
				)}
				{...props}
			>
				<div className="flex flex-col gap-6">{children}</div>
			</ModalPrimitive.Content>
		</ModalPortal>
	);
};

const ModalHeader: FC<React.ComponentProps<'div'>> = ({
	className,
	children,
	...props
}) => {
	return (
		<div
			data-slot="modal-header"
			className={cn(
				'sticky top-0 flex flex-col space-y-1.5 text-center sm:text-left bg-section px-10 pt-6 pb-4 mb-6',
				className
			)}
			{...props}
		>
			{children}
			<ModalPrimitive.Close
				asChild
				data-slot="modal-close"
				className="absolute z-50 right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-neutral-strong"
			>
				<Button variant="ghost" size="md" iconOnly>
					<X />
				</Button>
			</ModalPrimitive.Close>
		</div>
	);
};

const ModalFooter: FC<React.ComponentProps<'div'>> = ({
	className,
	...props
}) => {
	return (
		<div
			data-slot="modal-footer"
			className={cn(
				'sticky bottom-0 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-10 py-6 mt-6 bg-section',
				className
			)}
			{...props}
		/>
	);
};

const ModalTitle: FC<React.ComponentProps<typeof ModalPrimitive.Title>> = ({
	className,
	...props
}) => {
	return (
		<div className="">
			<ModalPrimitive.Title
				data-slot="modal-title"
				className={cn('title-2 text-neutral', className)}
				{...props}
			/>
		</div>
	);
};

const ModalDescription: FC<
	React.ComponentProps<typeof ModalPrimitive.Description>
> = ({ className, ...props }) => {
	return (
		<div className="">
			<ModalPrimitive.Description
				data-slot="modal-description"
				className={cn('body-2 text-neutral-strong', className)}
				{...props}
			/>
		</div>
	);
};

export {
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	ModalPortal,
	ModalTitle,
	ModalTrigger
};
