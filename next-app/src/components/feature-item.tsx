import { cn } from '@/components/shadcn/utils';
import { type FC, type ReactNode } from 'react';

export interface FeatureItemProps {
	icon: ReactNode;
	title: string;
	description: string;
	className?: string;
	iconBgClassName?: string;
}

export const FeatureItem: FC<FeatureItemProps> = ({
	icon,
	title,
	description,
	className,
	iconBgClassName = 'bg-accent-weak'
}) => {
	return (
		<div className={cn('flex gap-3 items-start', className)}>
			<div
				className={cn(
					'flex items-center justify-center rounded-[10px] size-8 shrink-0',
					iconBgClassName
				)}
			>
				<div className="size-4">{icon}</div>
			</div>
			<div className="flex flex-col gap-1 flex-1 min-w-0">
				<h3 className="title-3 text-neutral tracking-[-0.42px]">{title}</h3>
				<p className="body-2 text-neutral-strong">{description}</p>
			</div>
		</div>
	);
};
