import { cn } from '@/components/shadcn/utils';
import { type FC, type ReactNode } from 'react';

export interface SectionHeadingProps {
	title: string;
	description?: string;
	className?: string;
	children?: ReactNode;
}

export const SectionHeading: FC<SectionHeadingProps> = ({
	title,
	description,
	className,
	children
}) => {
	return (
		<div
			className={cn(
				'flex flex-col gap-3 text-center md:text-left items-center md:items-start',
				className
			)}
		>
			<h2 className="display-3 text-neutral">{title}</h2>
			{description && (
				<p className="body-1 text-neutral-strong md:max-w-[527px]">
					{description}
				</p>
			)}
			{children}
		</div>
	);
};
