'use client';

import { toastCallbacks } from '@/deps/unidy/callbacks';
import {
	useNewsletterPreferenceCenter,
	useSession,
	useUnidyClient
} from '@unidy.io/sdk-react';
import { useMemo, useState } from 'react';
import type { NewsletterCategory } from '../components/newsletter-picker';

export function useNewsletterPreferences({
	categories,
	preferenceToken
}: {
	categories: NewsletterCategory[];
	preferenceToken?: string;
}) {
	const session = useSession({ callbacks: toastCallbacks });
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
		callbacks: toastCallbacks
	});

	const subscribedIds = useMemo(
		() => subscriptions.map((s) => s.newsletter_internal_name),
		[subscriptions]
	);

	const [selectedIds, setSelectedIds] = useState<string[] | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const effectiveSelectedIds = selectedIds ?? subscribedIds;

	const allOptionIds = useMemo(
		() => categories.flatMap((c) => c.options.map((o) => o.id)),
		[categories]
	);
	const isAnythingMutating =
		isSaving || allOptionIds.some((id) => isMutating(id));

	const handleSave = async () => {
		const currentIds = effectiveSelectedIds;
		const toSubscribe = currentIds.filter(
			(id) => !subscribedIds.includes(id)
		);
		const toUnsubscribe = subscribedIds.filter(
			(id) => !currentIds.includes(id)
		);

		setIsSaving(true);
		try {
			await Promise.all([
				...toSubscribe.map(async (id) => {
					// Use the client directly with the session email to avoid
					// the SDK hook's empty email issue when no subscriptions exist yet
					if (session.email) {
						const [error] = await client.newsletters.create({
							payload: {
								email: session.email,
								newsletter_subscriptions: [
									{ newsletter_internal_name: id }
								],
								redirect_to_after_confirmation:
									window.location.href
							}
						});
						if (error) {
							toastCallbacks.onError?.(error);
						}
					} else {
						await subscribe(id);
					}
				}),
				...toUnsubscribe.map((id) => unsubscribe(id))
			]);

			// Refetch to sync SDK hook state after direct client calls
			if (toSubscribe.length > 0 && session.email) {
				await refetch();
			}
		} catch (error) {
			toastCallbacks.onError?.('Failed to update newsletter preferences');
		} finally {
			setIsSaving(false);
		}

		setSelectedIds(null);
	};

	const handleUnsubscribeAll = async () => {
		setIsSaving(true);
		try {
			await Promise.all(
				subscriptions.map((s) =>
					unsubscribe(s.newsletter_internal_name)
				)
			);
		} catch (error) {
			toastCallbacks.onError?.('Failed to unsubscribe');
		} finally {
			setIsSaving(false);
		}
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
