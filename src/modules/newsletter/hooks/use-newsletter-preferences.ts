'use client';

import { useNewsletterPreferenceCenter } from '@unidy.io/sdk-react';
import { useCallback, useMemo } from 'react';
import { mutationCallbackOptions } from '@/deps/unidy/callbacks';
import type { NewsletterCategory } from '../components/newsletter-picker';


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

	const subscribedIds = useMemo(() => {
		const ids: string[] = [];
		for (const sub of subscriptions) {
			const category = categories.find(
				(c) => c.id === sub.newsletter_internal_name
			);
			if (!category) continue;

			if (
				sub.preference_identifiers &&
				sub.preference_identifiers.length > 0
			) {
				ids.push(...sub.preference_identifiers);
			} else {
				ids.push(...category.options.map((o) => o.id));
			}
		}
		return ids;
	}, [subscriptions, categories]);

	const allNewsletterIds = useMemo(
		() => categories.map((c) => c.id),
		[categories]
	);
	const isAnythingMutating = allNewsletterIds.some((id) => isMutating(id));

	const togglePreference = useCallback(
		async (toggledId: string) => {
			// Find which category this option belongs to
			const category = categories.find((c) =>
				c.options.some((o) => o.id === toggledId)
			);
			if (!category) return;

			const isCurrentlySelected = subscribedIds.includes(toggledId);
			const optionIds = category.options.map((o) => o.id);

			// Compute new selected preferences for this category after toggle
			const currentForCategory = optionIds.filter((id) =>
				subscribedIds.includes(id)
			);
			const newForCategory = isCurrentlySelected
				? currentForCategory.filter((id) => id !== toggledId)
				: [...currentForCategory, toggledId];

			const isAlreadySubscribed = subscriptions.some(
				(s) => s.newsletter_internal_name === category.id
			);

			if (newForCategory.length === 0) {
				// No preferences left → unsubscribe from the newsletter
				await unsubscribe(category.id);
			} else if (isAlreadySubscribed) {
				// Already subscribed → update preferences
				await updatePreferences(category.id, newForCategory);
			} else {
				// Not subscribed yet → subscribe with selected preferences
				await subscribe(category.id, newForCategory);
			}
		},
		[categories, subscribedIds, subscriptions, subscribe, unsubscribe, updatePreferences]
	);

	return {
		isLoading,
		isAnythingMutating,
		subscribedIds,
		togglePreference
	};
}
