'use client';

import { Bell, Check, Info, Loader2, Trophy, Users } from 'lucide-react';
import { type FC, useState } from 'react';
import { Button } from '@/components/shadcn/ui/button';
import { cn } from '@/components/shadcn/utils';
import type { NewsletterSubscriptionState } from '../hooks/use-newsletter-preferences';

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
	/** When false, the category is subscribed/unsubscribed as a whole (no individual option toggling). */
	selectablePreferences?: boolean;
	options: NewsletterOption[];
}

export interface NewsletterPickerProps {
	categories: NewsletterCategory[];
	selectedIds?: string[];
	onChange?: (selectedIds: string[]) => void;
	onToggle?: (id: string) => void;
	disabled?: boolean;
	className?: string;
	subscriptionsByCategory?: Record<string, NewsletterSubscriptionState>;
	isNewsletterMutating?: (internalName: string) => boolean;
	onSubscribeNewsletter?: (internalName: string) => void;
	onUnsubscribeNewsletter?: (internalName: string) => void;
	onResendConfirmation?: (internalName: string) => void;
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
	onToggle,
	disabled = false,
	className,
	subscriptionsByCategory,
	isNewsletterMutating,
	onSubscribeNewsletter,
	onUnsubscribeNewsletter,
	onResendConfirmation
}) => {
	const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds));

	const effectiveSelected = onToggle ? new Set(selectedIds) : selected;

	const handleToggle = (id: string) => {
		if (disabled) return;

		if (onToggle) {
			onToggle(id);
			return;
		}

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
			{categories.map((category) => {
				const subscriptionState = subscriptionsByCategory?.[category.id];
				const isSelectable = category.selectablePreferences !== false;
				const isSubscribed =
					subscriptionState?.isSubscribed ??
					(isSelectable
						? category.options.some((option) =>
								effectiveSelected.has(option.id)
							)
						: false);
				const isConfirmed = subscriptionState?.isConfirmed ?? false;
				const isCategoryMutating =
					disabled || isNewsletterMutating?.(category.id) || false;
				const isEditingLocked = isSubscribed && !isConfirmed;

				return (
					<div
						key={category.id}
						className="bg-neutral-weak rounded-[12px] p-6 flex flex-col gap-4"
					>
						<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
							<div className="flex flex-col gap-1">
								<p className="caption text-neutral">{category.name}</p>
								<p className="body-3 text-neutral-strong">
									{category.description}
								</p>
							</div>

							<div className="flex flex-wrap items-center gap-2">
								<span
									className={cn(
										'caption rounded-full border px-3 py-1',
										isSubscribed
											? isConfirmed
												? 'border-accent bg-accent-weak text-accent'
												: 'border-neutral-medium bg-section text-neutral-strong'
											: 'border-neutral-medium bg-section text-neutral-strong'
									)}
								>
									{isSubscribed
										? isConfirmed
											? 'Confirmed'
											: 'Confirmation pending'
										: 'Not subscribed'}
								</span>

								{!isSubscribed && !isSelectable && onSubscribeNewsletter && (
									<Button
										type="button"
										theme="accent"
										variant="solid"
										size="xs"
										onClick={() => onSubscribeNewsletter(category.id)}
										disabled={isCategoryMutating}
									>
										{isCategoryMutating ? (
											<Loader2 className="animate-spin" />
										) : null}
										Subscribe
									</Button>
								)}

								{isSubscribed && onUnsubscribeNewsletter && (
									<Button
										type="button"
										theme="danger"
										variant="outline"
										size="xs"
										onClick={() => onUnsubscribeNewsletter(category.id)}
										disabled={isCategoryMutating}
									>
										{isCategoryMutating ? (
											<Loader2 className="animate-spin" />
										) : null}
										Unsubscribe
									</Button>
								)}
							</div>
						</div>

						{isEditingLocked && (
							<div className="bg-section border border-neutral-medium rounded-[10px] p-4 flex flex-col gap-3">
								<div className="flex gap-3 items-start">
									<Info className="size-5 text-accent shrink-0" />
									<div className="flex flex-col gap-1">
										<p className="body-2 text-neutral font-bold">
											Subscription not confirmed
										</p>
										<p className="body-3 text-neutral-strong">
											Confirm this newsletter from your email before updating
											its preferences, or unsubscribe above if you no longer
											want it.
										</p>
									</div>
								</div>

								{onResendConfirmation && (
									<Button
										type="button"
										theme="neutral"
										variant="outline"
										size="xs"
										className="w-fit"
										onClick={() => onResendConfirmation(category.id)}
										disabled={isCategoryMutating}
									>
										{isCategoryMutating ? (
											<Loader2 className="animate-spin" />
										) : null}
										Resend confirmation email
									</Button>
								)}
							</div>
						)}

						{isSelectable ? (
							<div className="flex flex-col gap-3">
								{category.options.map((option) => {
									const Icon = iconMap[option.icon];
									const isSelected = effectiveSelected.has(option.id);
									const isOptionDisabled =
										isCategoryMutating || (isSubscribed && !isConfirmed);

									return (
										<button
											key={option.id}
											type="button"
											onClick={() => handleToggle(option.id)}
											disabled={isOptionDisabled}
											className={cn(
												'flex gap-4 items-start p-[18px] rounded-[12px] transition-all text-left',
												isSelected
													? 'bg-accent-weak border-2 border-accent'
													: 'bg-section border-2 border-neutral-weak',
												isOptionDisabled && 'opacity-50 cursor-not-allowed',
												!isOptionDisabled &&
													'cursor-pointer hover:border-neutral-medium'
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
						) : (
							<div className="flex flex-col gap-3">
								<div className="bg-section border border-neutral-medium rounded-[10px] p-4">
									<p className="body-3 text-neutral-strong">
										This newsletter is managed as a single subscription. Use the
										button above to subscribe or unsubscribe from the whole
										list.
									</p>
								</div>

								{category.options.map((option) => {
									const Icon = iconMap[option.icon];

									return (
										<div
											key={option.id}
											className="flex gap-4 items-start p-[18px] rounded-[12px] bg-section border-2 border-neutral-weak"
										>
											<div className="size-10 rounded-[10px] flex items-center justify-center shrink-0 bg-neutral-weak">
												<Icon className="size-5 text-neutral-strong" />
											</div>
											<div className="flex-1 flex flex-col gap-1 min-w-0">
												<p className="title-3 text-neutral">{option.title}</p>
												<p className="body-3 text-neutral-strong">
													{option.description}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};
