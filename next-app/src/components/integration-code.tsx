'use client';

import { Code } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Button } from '@/components/shadcn/ui/button';
import { cn } from '@/components/shadcn/utils';

export interface IntegrationCodeProps {
	code: string;
	language?: string;
	className?: string;
	defaultExpanded?: boolean;
}

const customTheme = {
	...oneDark,
	'code[class*="language-"]': {
		...oneDark['code[class*="language-"]'],
		background: '#101828',
		color: '#ffffff',
		fontFamily:
			"'Fira Code', 'FiraCode Nerd Font Mono', 'Monaco', 'Courier New', monospace",
		fontSize: '13px',
		lineHeight: '20px',
		fontWeight: '500'
	},
	'pre[class*="language-"]': {
		...oneDark['pre[class*="language-"]'],
		background: '#101828',
		padding: '16px',
		borderRadius: '10px',
		margin: '0',
		overflow: 'auto'
	},
	'.token.keyword': {
		color: '#ff716c'
	},
	'.token.string': {
		color: '#97d8ff'
	},
	'.token.comment': {
		color: '#929292',
		fontStyle: 'normal'
	},
	'.token.class-name': {
		color: '#daa6ff'
	},
	'.token.function': {
		color: '#daa6ff'
	},
	'.token.operator': {
		color: '#ff716c'
	},
	'.token.punctuation': {
		color: '#ffffff'
	},
	'.token.property': {
		color: '#ffffff'
	},
	'.token.boolean': {
		color: '#ff716c'
	},
	'.token.number': {
		color: '#97d8ff'
	}
};

export function IntegrationCode({
	code,
	language = 'typescript',
	className,
	defaultExpanded = false
}: IntegrationCodeProps) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	return (
		<div className={cn('flex flex-col gap-3 w-full', className)}>
			<Button
				theme="accent"
				variant="ghost"
				size="md"
				className="w-fit h-8 px-4"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<Code className="size-4" />
				{isExpanded ? 'Hide Integration Code' : 'View Integration Code'}
			</Button>

			{/* Animated container using CSS Grid for smooth height transition */}
			<div
				className="grid transition-all duration-500 ease-in-out overflow-hidden"
				style={{
					gridTemplateRows: isExpanded ? '1fr' : '0fr',
					opacity: isExpanded ? 1 : 0
				}}
			>
				<div className="min-h-0">
					<div className="bg-[#101828] rounded-[10px] overflow-hidden [&_pre]:!bg-[#101828] [&_pre]:!p-4 [&_pre]:!rounded-[10px] [&_pre]:!m-0 [&_code]:!text-[13px] [&_code]:!leading-[20px] [&_code]:!font-medium [&_.token.keyword]:!text-[#ff716c] [&_.token.string]:!text-[#97d8ff] [&_.token.comment]:!text-[#929292] [&_.token.class-name]:!text-[#daa6ff] [&_.token.function]:!text-[#daa6ff] [&_.token.operator]:!text-[#ff716c] [&_.token.punctuation]:!text-white [&_.token.property]:!text-white [&_.token.boolean]:!text-[#ff716c] [&_.token.number]:!text-[#97d8ff]">
						<SyntaxHighlighter
							language={language}
							style={customTheme}
							customStyle={{
								margin: 0,
								padding: '16px',
								background: '#101828',
								borderRadius: '10px',
								fontSize: '13px',
								lineHeight: '20px',
								fontFamily:
									"'Fira Code', 'FiraCode Nerd Font Mono', 'Monaco', 'Courier New', monospace",
								fontWeight: '500'
							}}
							PreTag="div"
							codeTagProps={{
								style: {
									fontFamily:
										"'Fira Code', 'FiraCode Nerd Font Mono', 'Monaco', 'Courier New', monospace",
									fontSize: '13px',
									lineHeight: '20px',
									fontWeight: '500'
								}
							}}
						>
							{code}
						</SyntaxHighlighter>
					</div>
				</div>
			</div>
		</div>
	);
}
