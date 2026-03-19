'use client';

import { Loader2 } from 'lucide-react';
import type { FC } from 'react';
import { NewsletterPicker } from '@/modules/newsletter/components/newsletter-picker';
import { newsletterCategories } from '@/modules/newsletter/constants/newsletter-data';
import { useNewsletterPreferences } from '@/modules/newsletter/hooks/use-newsletter-preferences';

export const ProfileNewsletterPage: FC = () => {
	const {
		isLoading,
		isAnythingMutating,
		isNewsletterMutating,
		subscriptionsByCategory,
		subscribedIds,
		subscribeNewsletter,
		unsubscribeNewsletter,
		resendConfirmationEmail,
		togglePreference
	} = useNewsletterPreferences({ categories: newsletterCategories });
	const confirmationReturnUrl =
		typeof window === 'undefined'
			? undefined
			: `${window.location.origin}/newsletter/manage`;

	return (
		<div className="flex flex-col gap-6 grow">
			<div className="bg-section border border-neutral-weak rounded-[12px] p-10 flex flex-col gap-6 grow">
				<div className="flex flex-col gap-1">
					<h2 className="title-2 text-neutral">Newsletter Preferences</h2>
					<p className="body-2 text-neutral-strong">
						Manage your email subscriptions and choose what content you want to
						receive from FC Unidy.
					</p>
				</div>

				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-3">
						<p className="title-3 text-neutral-strong">
							Newsletter Subscriptions
						</p>
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="size-6 animate-spin text-neutral-strong" />
							</div>
						) : (
							<NewsletterPicker
								categories={newsletterCategories}
								selectedIds={subscribedIds}
								subscriptionsByCategory={subscriptionsByCategory}
								onToggle={togglePreference}
								onSubscribeNewsletter={subscribeNewsletter}
								onUnsubscribeNewsletter={unsubscribeNewsletter}
								onResendConfirmation={(internalName) =>
									void resendConfirmationEmail(
										internalName,
										confirmationReturnUrl
									)
								}
								disabled={isAnythingMutating}
								isNewsletterMutating={isNewsletterMutating}
							/>
						)}
					</div>

					<div className="bg-neutral-weak border border-neutral-medium rounded-[10px] p-4 flex flex-col gap-2">
						<p className="body-2 text-neutral-strong font-bold">Need help?</p>
						<p className="body-2 text-neutral-strong">
							You can update these preferences at any time by visiting this page
							or clicking the preferences link in any of our emails.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
