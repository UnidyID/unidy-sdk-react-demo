import { cn } from '@/components/shadcn/utils';
import { Check } from 'lucide-react';
import { type FC, type ReactNode } from 'react';

export interface CardSelectProps {
	icon: ReactNode;
	title: string;
	description: string;
	selected?: boolean;
	onClick?: () => void;
	className?: string;
	iconBgClassName?: string;
}

export const CardSelect: FC<CardSelectProps> = ({
	icon,
	title,
	description,
	selected = false,
	onClick,
	className,
	iconBgClassName = 'bg-neutral-weak'
}) => {
	return (
		<button
			onClick={onClick}
			className={cn(
				'border-2 rounded-[12px] p-[18px] flex gap-4 items-start w-full text-left transition-all hover:border-neutral-medium bg-section',
				selected ? 'border-neutral-strong' : 'border-neutral-weak',
				className
			)}
		>
			<div
				className={cn(
					'flex items-center justify-center rounded-[10px] size-10 shrink-0',
					iconBgClassName
				)}
			>
				<div className="size-5">{icon}</div>
			</div>
			<div className="flex flex-col gap-1 flex-1 min-w-0">
				<h3 className="title-3 text-neutral tracking-[-0.42px]">{title}</h3>
				<p className="body-3 text-neutral-strong">{description}</p>
			</div>
			<div
				className={cn(
					'border-2 rounded-full size-5 shrink-0 flex items-center justify-center',
					selected
						? 'border-neutral-strong bg-neutral-strong'
						: 'border-neutral-strong'
				)}
			>
				{selected && <Check className="size-3 text-section" />}
			</div>
		</button>
	);
};
