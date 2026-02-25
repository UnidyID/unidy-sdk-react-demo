'use client';

import { toastCallbacks } from '@/deps/unidy/callbacks';
import { useNewsletterPreferenceCenter } from '@unidy.io/sdk-react';
import { useMemo, useState } from 'react';
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
		unsubscribe
	} = useNewsletterPreferenceCenter({
		preferenceToken,
		callbacks: toastCallbacks
	});

	const subscribedIds = useMemo(
		() => subscriptions.map((s) => s.newsletter_internal_name),
		[subscriptions]
	);

	const [selectedIds, setSelectedIds] = useState<string[] | null>(null);

	const effectiveSelectedIds = selectedIds ?? subscribedIds;

	const allOptionIds = useMemo(
		() => categories.flatMap((c) => c.options.map((o) => o.id)),
		[categories]
	);
	const isAnythingMutating = allOptionIds.some((id) => isMutating(id));

	const handleSave = async () => {
		const currentIds = effectiveSelectedIds;
		const toSubscribe = currentIds.filter(
			(id) => !subscribedIds.includes(id)
		);
		const toUnsubscribe = subscribedIds.filter(
			(id) => !currentIds.includes(id)
		);

		await Promise.all([
			...toSubscribe.map((id) => subscribe(id)),
			...toUnsubscribe.map((id) => unsubscribe(id))
		]);

		setSelectedIds(null);
	};

	const handleUnsubscribeAll = async () => {
		await Promise.all(
			subscriptions.map((s) => unsubscribe(s.newsletter_internal_name))
		);
		setSelectedIds(null);
	};

	return {
		isLoading,
		isAnythingMutating,
		effectiveSelectedIds,
		setSelectedIds,
		handleSave,
		handleUnsubscribeAll
	};
}
