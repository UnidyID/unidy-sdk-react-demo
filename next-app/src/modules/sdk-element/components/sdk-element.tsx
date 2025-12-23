'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { Code, ExternalLink } from 'lucide-react';

import { Button } from '@/components/shadcn/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/shadcn/ui/popover';

const sdkElementVariants = cva(
	'absolute border-2 border-sdk rounded-[12px] pointer-events-none',
	{
		variants: {
			size: {
				lg: 'inset-[-16px]',
				sm: 'inset-[-8px]'
			},
			labelPosition: {
				'top-left': '',
				'top-right': '',
				'bottom-left': '',
				'bottom-right': ''
			}
		},
		defaultVariants: {
			size: 'lg',
			labelPosition: 'top-right'
		}
	}
);

const sdkLabelVariants = cva(
	'absolute bg-sdk text-sdk-contrast px-3 py-0 h-6 flex items-center gap-1 caption rounded-tl-lg rounded-tr-lg hover:opacity-90 transition-opacity',
	{
		variants: {
			labelPosition: {
				'top-left':
					'top-[-32px] left-[-0px] rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none',
				'top-right':
					'top-[-32px] right-[-0px] rounded-tl-lg rounded-tr-lg rounded-bl-none rounded-br-none',
				'bottom-left':
					'bottom-[-32px] left-[-0px] rounded-bl-lg rounded-br-lg rounded-tl-none rounded-tr-none',
				'bottom-right':
					'bottom-[-32px] right-[-0px] rounded-bl-lg rounded-br-lg rounded-tl-none rounded-tr-none'
			},
			attatched: {
				true: '',
				false: ''
			}
		},
		compoundVariants: [
			{ labelPosition: 'top-left', attatched: true, className: '' }
		],
		defaultVariants: {
			labelPosition: 'top-right'
		}
	}
);

export interface SDKElementProps
	extends VariantProps<typeof sdkElementVariants> {
	title: string;
	codeSnippet: string;
	docLink?: string;
}

export function SDKElement({
	title,
	codeSnippet,
	docLink = '#',
	size = 'lg',
	labelPosition = 'top-right'
}: SDKElementProps) {
	return (
		<>
			{/* Border/Background */}
			<div className={sdkElementVariants({ size, labelPosition })} />

			{/* Label with Popover */}
			<Popover>
				<PopoverTrigger asChild>
					<button
						className={sdkLabelVariants({ labelPosition })}
						aria-label="View SDK code"
					>
						<span>{title}</span>
						<Code className="size-4" />
					</button>
				</PopoverTrigger>
				<PopoverContent
					align={labelPosition?.includes('right') ? 'end' : 'start'}
					side={labelPosition?.includes('bottom') ? 'top' : 'bottom'}
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
		</>
	);
}
