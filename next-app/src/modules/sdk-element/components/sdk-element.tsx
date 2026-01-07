'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Code, ExternalLink } from 'lucide-react';

import { Button } from '@/components/shadcn/ui/button';
import { Popover, PopoverContent } from '@/components/shadcn/ui/popover';
import { cn } from '@/components/shadcn/utils';
import { useViewportSize } from '@/lib/viewport-size';
import { PopoverAnchor } from '@radix-ui/react-popover';
import { useState } from 'react';

const sdkElementOutlineVariants = cva(
	cn(
		'absolute duration-300 peer-hover:duration-100',
		'border-2 peer-hover:border-4 peer-data-[active=true]:border-4',
		'pointer-events-none',
		'border-sdk',
		'group-has-[.sdk-label:hover,.sdk-label[data-active=true]]/sdklabels:border-sdk-medium',
		'peer-hover:border-sdk!',
		'peer-data-[active=true]:border-sdk!',
		'inset-[calc(-1*var(--inset))] rounded-[12px]'
	),
	{
		variants: {
			size: {
				lg: '[--inset:16px] peer-hover:[--inset:17px] peer-data-[active=true]:[--inset:17px]',
				sm: '[--inset:8px] peer-hover:[--inset:9px] peer-data-[active=true]:[--inset:9px]'
			},
			labelPosition: {
				'top-left': '',
				'top-right': '',
				'bottom-left': '',
				'bottom-right': ''
			},
			// unused
			detatched: {
				true: '',
				false: ''
			}
		}
	}
);

const sdkElementLabelVariants = cva(
	cn(
		'sdk-label z-10',
		'absolute flex items-center gap-1 caption rounded-lg cursor-pointer duration-300 hover:duration-100 whitespace-nowrap',
		// colors
		'bg-sdk text-sdk-contrast peer',
		'group-has-[.sdk-label:hover,.sdk-label[data-active=true]]/sdklabels:bg-sdk-medium',
		'hover:bg-sdk!',
		'data-[active=true]:bg-sdk!',
		// sizing
		'py-0',
		'px-3 hover:px-4 data-[active=true]:px-4',
		'h-6 hover:h-7 data-[active=true]:h-7',
		'[--offset-x:4px] hover:[--offset-x:0px] data-[active=true]:[--offset-x:0px]',
		'[--offset-y:0px] hover:[--offset-y:2px] data-[active=true]:[--offset-y:2px]'
	),
	{
		variants: {
			labelPosition: {
				'top-left': '',
				'top-right': '',
				'bottom-left': '',
				'bottom-right': ''
			},
			size: {
				lg: '[--inset:-16px]',
				sm: '[--inset:-8px]'
			},
			detatched: {
				true: '',
				false: ''
			}
		},
		compoundVariants: [
			// Small
			{
				labelPosition: 'top-left',
				detatched: false,
				className:
					'top-[calc(var(--inset)-24px-var(--offset-y))] left-[var(--offset-x)] rounded-bl-none rounded-br-none'
			},
			{
				labelPosition: 'top-right',
				detatched: false,
				className:
					'top-[calc(var(--inset)-24px-var(--offset-y))] right-[var(--offset-x)] rounded-bl-none rounded-br-none'
			},
			{
				labelPosition: 'bottom-left',
				detatched: false,
				className:
					'bottom-[calc(var(--inset)-24px-var(--offset-y))] left-[var(--offset-x)] rounded-tl-none rounded-tr-none'
			},
			{
				labelPosition: 'bottom-right',
				detatched: false,
				className:
					'bottom-[calc(var(--inset)-24px-var(--offset-y))] right-[var(--offset-x)] rounded-tl-none rounded-tr-none'
			},

			// Large
			{
				labelPosition: 'top-left',
				detatched: true,
				className:
					'top-[calc(var(--inset)-28px-var(--offset-y))] left-[var(--offset-x)]'
			},
			{
				labelPosition: 'top-right',
				detatched: true,
				className:
					'top-[calc(var(--inset)-28px-var(--offset-y))] right-[var(--offset-x)]'
			},
			{
				labelPosition: 'bottom-left',
				detatched: true,
				className:
					'bottom-[calc(var(--inset)-28px-var(--offset-y))] left-[var(--offset-x)]'
			},
			{
				labelPosition: 'bottom-right',
				detatched: true,
				className:
					'bottom-[calc(var(--inset)-28px-var(--offset-y))] right-[var(--offset-x)]'
			}
		]
	}
);

export interface SDKElementProps
	extends VariantProps<typeof sdkElementOutlineVariants> {
	title: string;
	codeSnippet: string;
	docLink?: string;
	detatched?: boolean;
	popoverPosition?: 'left' | 'right' | 'top' | 'bottom';
}

export function SDKElement({
	title,
	codeSnippet,
	docLink = '#',
	size = 'lg',
	detatched = false,
	labelPosition = 'top-right',
	popoverPosition = 'top'
}: SDKElementProps) {
	const [open, setOpen] = useState(false);
	const { isMobile } = useViewportSize();

	return (
		<>
			{/* Label with Popover */}
			<button
				className={sdkElementLabelVariants({ size, labelPosition, detatched })}
				aria-label="View SDK code"
				onClick={() => setOpen(true)}
				{...{ 'data-active': open }}
			>
				<span>{title}</span>
				<Code className="size-4" />
			</button>

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverAnchor asChild>
					<div
						className={sdkElementOutlineVariants({
							size,
							labelPosition,
							detatched
						})}
					/>
				</PopoverAnchor>
				<PopoverContent
					// align={labelPosition?.includes('right') ? 'end' : 'start'}
					// side={labelPosition?.includes('bottom') ? 'top' : 'bottom'}
					side={isMobile ? 'top' : popoverPosition}
					sideOffset={8}
					className="w-96 max-w-[calc(100vw-2rem)] p-0 border-2 border-sdk rounded-xl shadow-2xl overflow-hidden"
				>
					<div className="bg-sdk text-sdk-contrast px-4 py-3 flex items-center justify-between">
						<span className="text-sm font-bold">SDK Implementation</span>
					</div>
					<div className="p-4 space-y-4">
						<div>
							<a href={docLink}>
								<Button theme="sdk" variant="link" size="link">
									<ExternalLink className="size-4" />
									View Documentation
								</Button>
							</a>
						</div>
						<div>
							<div className="text-xs text-neutral-strong mb-2">
								Code Snippet:
							</div>
							<div className="bg-neutral rounded-lg p-3 overflow-x-auto">
								<pre className="text-xs text-neutral-contrast">
									<code>{codeSnippet}</code>
								</pre>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>

			{/* Border/Background */}
		</>
	);
}
