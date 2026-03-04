import { cn } from '@/components/shadcn/utils';
import { Shield } from 'lucide-react';
import { type FC } from 'react';

export interface LogoProps {
	text?: string;
	className?: string;
	iconClassName?: string;
	textClassName?: string;
}

export const Logo: FC<LogoProps> = ({
	text = 'FC Unidy',
	className,
	iconClassName,
	textClassName
}) => {
	return (
		<div className={cn('flex gap-2 items-center h-10', className)}>
			<div
				className={cn(
					'bg-accent text-accent-contrast rounded-full size-10 flex items-center justify-center shrink-0',
					iconClassName
				)}
			>
				<Shield />
			</div>
			<span className={cn('title-2 text-accent', textClassName)}>{text}</span>
		</div>
	);
};
