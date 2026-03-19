'use client';

import {
	useNewsletterPreferenceCenter,
	useNewsletterResendConfirmation,
	type ExistingSubscription
} from '@unidy.io/sdk-react';
import { useCallback, useMemo, useState } from 'react';
import { mutationCallbackOptions } from '@/deps/unidy/callbacks';
import type { NewsletterCategory } from '../components/newsletter-picker';

export type NewsletterSubscriptionState = {
	subscription?: ExistingSubscription;
	isSubscribed: boolean;
	isConfirmed: boolean;
};

export function useNewsletterPreferences({
	categories,
	preferenceToken
}: {
	categories: NewsletterCategory[];
	preferenceToken?: string;
}) {
	const {
		subscriptions,
		isLoading,
		isMutating,
		subscribe,
		unsubscribe,
		updatePreferences
	} = useNewsletterPreferenceCenter({
		preferenceToken,
		callbacks: mutationCallbackOptions
	});
	const { resendConfirmation } = useNewsletterResendConfirmation({
		preferenceToken,
		callbacks: mutationCallbackOptions
	});
	const [resendingNewsletter, setResendingNewsletter] = useState<string | null>(
		null
	);

	const subscriptionsByCategory = useMemo<
		Record<string, NewsletterSubscriptionState>
	>(() => {
		return Object.fromEntries(
			categories.map((category) => {
				const subscription = subscriptions.find(
					(sub) => sub.newsletter_internal_name === category.id
				);

				return [
					category.id,
					{
						subscription,
						isSubscribed: !!subscription,
						isConfirmed: subscription?.confirmed ?? false
					}
				];
			})
		);
	}, [categories, subscriptions]);

	const subscribedIds = useMemo(() => {
		const ids: string[] = [];

		for (const category of categories) {
			const subscription = subscriptionsByCategory[category.id]?.subscription;
			if (!subscription) continue;
			if (category.selectablePreferences === false) continue;

			if (
				subscription.preference_identifiers &&
				subscription.preference_identifiers.length > 0
			) {
				ids.push(...subscription.preference_identifiers);
			} else {
				ids.push(...category.options.map((option) => option.id));
			}
		}

		return ids;
	}, [subscriptionsByCategory, categories]);

	const allNewsletterIds = useMemo(
		() => categories.map((category) => category.id),
		[categories]
	);

	const isNewsletterMutating = useCallback(
		(internalName: string) =>
			isMutating(internalName) || resendingNewsletter === internalName,
		[isMutating, resendingNewsletter]
	);

	const isAnythingMutating = allNewsletterIds.some((internalName) =>
		isNewsletterMutating(internalName)
	);

	const togglePreference = useCallback(
		async (toggledId: string) => {
			const category = categories.find((currentCategory) =>
				currentCategory.options.some((option) => option.id === toggledId)
			);
			if (!category) return;
			if (category.selectablePreferences === false) return;

			const subscriptionState = subscriptionsByCategory[category.id];
			if (subscriptionState?.isSubscribed && !subscriptionState.isConfirmed) {
				return;
			}

			const isCurrentlySelected = subscribedIds.includes(toggledId);
			const optionIds = category.options.map((option) => option.id);
			const currentForCategory = optionIds.filter((id) =>
				subscribedIds.includes(id)
			);
			const newForCategory = isCurrentlySelected
				? currentForCategory.filter((id) => id !== toggledId)
				: [...currentForCategory, toggledId];

			if (newForCategory.length === 0) {
				await unsubscribe(category.id);
			} else if (subscriptionState?.isSubscribed) {
				await updatePreferences(category.id, newForCategory);
			} else {
				await subscribe(category.id, newForCategory);
			}
		},
		[
			categories,
			subscribedIds,
			subscriptionsByCategory,
			subscribe,
			unsubscribe,
			updatePreferences
		]
	);

	const subscribeNewsletter = useCallback(
		async (internalName: string) => {
			await subscribe(internalName);
		},
		[subscribe]
	);

	const unsubscribeNewsletter = useCallback(
		async (internalName: string) => {
			await unsubscribe(internalName);
		},
		[unsubscribe]
	);

	const resendConfirmationEmail = useCallback(
		async (internalName: string, redirectToAfterConfirmation?: string) => {
			setResendingNewsletter(internalName);

			try {
				return await resendConfirmation(
					internalName,
					redirectToAfterConfirmation
				);
			} finally {
				setResendingNewsletter((current) =>
					current === internalName ? null : current
				);
			}
		},
		[resendConfirmation]
	);

	return {
		isLoading,
		isAnythingMutating,
		isNewsletterMutating,
		subscribedIds,
		subscriptionsByCategory,
		subscriptionCount: subscriptions.length,
		togglePreference,
		subscribeNewsletter,
		unsubscribeNewsletter,
		resendConfirmationEmail
	};
}
