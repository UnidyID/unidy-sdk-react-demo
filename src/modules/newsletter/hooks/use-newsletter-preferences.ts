'use client';

import {
	useNewsletterPreferenceCenter,
	useSession,
	useUnidyClient
} from '@unidy.io/sdk-react';
import { useCallback, useMemo, useState } from 'react';
import {
	fetchCallbackOptions,
	mutationCallbackOptions
} from '@/deps/unidy/callbacks';
import type { NewsletterCategory } from '../components/newsletter-picker';


export function useNewsletterPreferences({
	categories,
	preferenceToken
}: {
	categories: NewsletterCategory[];
	preferenceToken?: string;
}) {
	const session = useSession({ callbacks: fetchCallbackOptions });
	const client = useUnidyClient();

	const {
		subscriptions,
		isLoading,
		isMutating,
		subscribe,
		unsubscribe,
		refetch
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

	const [isSaving, setIsSaving] = useState(false);

	const allNewsletterIds = useMemo(
		() => categories.map((c) => c.id),
		[categories]
	);
	const isAnythingMutating =
		isSaving || allNewsletterIds.some((id) => isMutating(id));

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

			setIsSaving(true);
			try {
				if (newForCategory.length === 0) {
					// No preferences left → unsubscribe from the newsletter
					await unsubscribe(category.id);
				} else if (session.email) {
					// Subscribe/update with the new preference set
					const [error] = await client.newsletters.create({
						payload: {
							email: session.email,
							newsletter_subscriptions: [
								{
									newsletter_internal_name: category.id,
									preference_identifiers: newForCategory
								}
							],
							redirect_to_after_confirmation: window.location.href
						}
					});
					if (error) {
						mutationCallbackOptions.onError?.(error);
					} else {
						await refetch();
					}
				} else {
					await subscribe(category.id);
				}
			} catch {
				mutationCallbackOptions.onError?.(
					'Failed to update newsletter preference'
				);
			} finally {
				setIsSaving(false);
			}
		},
		[categories, subscribedIds, session.email, client, subscribe, unsubscribe, refetch]
	);

	return {
		isLoading,
		isAnythingMutating,
		subscribedIds,
		togglePreference
	};
}
