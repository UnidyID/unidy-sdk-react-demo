import { cn } from '@/components/shadcn/utils';
import { type FC, type PropsWithChildren } from 'react';

export interface OptionItemProps extends PropsWithChildren {
	icon: React.ReactNode;
	title: string;
	description: string;
	className?: string;
	iconBgClassName?: string;
}

export const OptionItem: FC<OptionItemProps> = ({
	icon,
	title,
	description,
	children,
	className,
	iconBgClassName = 'bg-accent'
}) => {
	return (
		<div
			className={cn(
				'bg-section border-2 border-accent rounded-[16px] py-6 px-0 sm:px-0 flex sm:flex-col flex-row gap-4',
				className
			)}
		>
			<div className="flex flex-col gap-4 flex-1 shrink-0">
				{/* Icon */}
				<div className="flex items-center px-6">
					<div
						className={cn(
							'flex items-center justify-center rounded-[12px] size-12 shrink-0',
							iconBgClassName
						)}
					>
						<div className="size-6">{icon}</div>
					</div>
				</div>

				{/* Title and Description */}
				<div className="flex flex-col gap-2 px-6">
					<h3 className="title-2 text-neutral tracking-[-0.54px]">{title}</h3>
					<p className="body-2 text-neutral-strong">{description}</p>
				</div>
			</div>

			{/* Buttons (Children) */}
			<div className="flex flex-col gap-0 px-2 flex-1 shrink-0">{children}</div>
		</div>
	);
};
