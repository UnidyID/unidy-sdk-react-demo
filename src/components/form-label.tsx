import { type FC, type PropsWithChildren } from 'react';

import { cn } from '@/components/shadcn/utils';

export const FormLabel: FC<
	{
		title?: string;
		error?: string;
		description?: string;
		required?: boolean;
		className?: string;
	} & PropsWithChildren
> = ({ title, error, description, required, children, className }) => {
	return (
		<div className={cn('flex flex-col gap-1 w-full', className)}>
			{title && (
				<p className="caption text-neutral-strong">
					{title} {required && <span className="text-neutral">*</span>}
				</p>
			)}
			{children}
			{description && (
				<p className="body-3 text-neutral-strong">{description}</p>
			)}
			{error && <p className="body-2 text-danger">{error}</p>}
		</div>
	);
};
