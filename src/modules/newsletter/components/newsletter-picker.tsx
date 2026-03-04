'use client';

import { cn } from '@/components/shadcn/utils';
import { Bell, Check, Trophy, Users } from 'lucide-react';
import { useState, type FC } from 'react';

export interface NewsletterOption {
	id: string;
	title: string;
	description: string;
	icon: 'trophy' | 'users' | 'bell';
	category: string;
}

export interface NewsletterCategory {
	id: string;
	name: string;
	description: string;
	options: NewsletterOption[];
}

export interface NewsletterPickerProps {
	categories: NewsletterCategory[];
	selectedIds?: string[];
	onChange?: (selectedIds: string[]) => void;
	disabled?: boolean;
	className?: string;
}

const iconMap = {
	trophy: Trophy,
	users: Users,
	bell: Bell
};

export const NewsletterPicker: FC<NewsletterPickerProps> = ({
	categories,
	selectedIds = [],
	onChange,
	disabled = false,
	className
}) => {
	const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds));

	const handleToggle = (id: string) => {
		if (disabled) return;

		const newSelected = new Set(selected);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelected(newSelected);
		onChange?.(Array.from(newSelected));
	};

	return (
		<div className={cn('flex flex-col gap-6', className)}>
			{categories.map((category) => (
				<div
					key={category.id}
					className="bg-neutral-weak rounded-[12px] p-6 flex flex-col gap-3"
				>
					<div className="flex flex-col gap-1">
						<p className="caption text-neutral">{category.name}</p>
						<p className="body-3 text-neutral-strong">{category.description}</p>
					</div>
					<div className="flex flex-col gap-3">
						{category.options.map((option) => {
							const Icon = iconMap[option.icon];
							const isSelected = selected.has(option.id);

							return (
								<button
									key={option.id}
									type="button"
									onClick={() => handleToggle(option.id)}
									disabled={disabled}
									className={cn(
										'flex gap-4 items-start p-[18px] rounded-[12px] transition-all text-left',
										isSelected
											? 'bg-accent-weak border-2 border-accent'
											: 'bg-section border-2 border-neutral-weak',
										disabled && 'opacity-50 cursor-not-allowed',
										!disabled && 'cursor-pointer hover:border-neutral-medium'
									)}
								>
									<div
										className={cn(
											'size-10 rounded-[10px] flex items-center justify-center shrink-0',
											isSelected ? 'bg-accent' : 'bg-neutral-weak'
										)}
									>
										<Icon
											className={cn(
												'size-5',
												isSelected
													? 'text-accent-contrast'
													: 'text-neutral-strong'
											)}
										/>
									</div>
									<div className="flex-1 flex flex-col gap-1 min-w-0">
										<p className="title-3 text-neutral">{option.title}</p>
										<p className="body-3 text-neutral-strong">
											{option.description}
										</p>
									</div>
									<div
										className={cn(
											'size-5 rounded-full border-2 shrink-0 flex items-center justify-center',
											isSelected
												? 'border-accent bg-accent'
												: 'border-neutral-strong'
										)}
									>
										{isSelected && (
											<Check className="size-4 text-accent-contrast" />
										)}
									</div>
								</button>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
};
