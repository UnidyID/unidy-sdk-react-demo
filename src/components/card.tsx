import { cn } from '@/components/shadcn/utils';
import { type FC, type PropsWithChildren } from 'react';

export interface CardProps extends PropsWithChildren {
	className?: string;
}

export const Card: FC<CardProps> = ({ children, className }) => {
	return (
		<div
			className={cn(
				'bg-section border-2 border-neutral-medium rounded-[12px] shadow-[0px_8px_12px_-4px_rgba(0,0,0,0.1)] p-10 flex flex-col',
				className
			)}
		>
			{children}
		</div>
	);
};
