'use client';

import { toastCallbacks } from '@/deps/unidy/callbacks';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';
import {
	SubscriptionCard,
	SubscriptionCardProps
} from '@/modules/tickets/components/subscription-card';
import { formatDate, formatPrice, mapItemState } from '@/modules/tickets/utils';
import { Button } from '@/components/shadcn/ui/button';
import {
	usePagination,
	useSession,
	useTicketables,
	type Subscription
} from '@unidy.io/sdk-react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const fallbackSubscriptions: (SubscriptionCardProps & { id: string })[] = [
	{
		id: 'sub-001',
		title: 'Season Ticket 2024/25',
		subtitle: 'Season Pass',
		status: 'active' as const,
		validUntil: '30/05/2025',
		remainingMatches: '12 matches',
		benefits: [
			'Priority seating',
			'Exclusive merchandise discount',
			'Early ticket access'
		],
		annualPrice: '$850'
	}
];

function mapSubscriptionToCardProps(
	subscription: Subscription
): SubscriptionCardProps & { id: string } {
	return {
		id: subscription.id,
		title: subscription.title,
		subtitle: subscription.text,
		status: mapItemState(subscription.state),
		validUntil: formatDate(subscription.ends_at),
		remainingMatches: subscription.payment_frequency ?? 'N/A',
		benefits: [],
		annualPrice: formatPrice(subscription.price, subscription.currency)
	};
}

export const MembershipsExample = () => {
	const [mounted, setMounted] = useState(false);
	const { isAuthenticated } = useSession();
	const pagination = usePagination({ perPage: 10 });
	const { items, isLoading } = useTicketables({
		type: 'subscription',
		pagination,
		filter: { orderBy: 'starts_at', orderDirection: 'desc' },
		fetchOnMount: isAuthenticated,
		callbacks: toastCallbacks
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	const loggedIn = mounted && isAuthenticated;

	const subscriptions = loggedIn
		? items.map(mapSubscriptionToCardProps)
		: fallbackSubscriptions;

	if (loggedIn && isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="size-6 animate-spin text-neutral-strong" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 w-full">
			{subscriptions.map((subscription) => (
				<SDKWrapper
					key={subscription.id}
					title="Tickets SDK / Subscription Card"
					codeSnippet={`const { items } = useTicketables({
  type: 'subscription',
  pagination,
  filter: { orderBy: 'starts_at', orderDirection: 'desc' },
  callbacks: toastCallbacks,
});`}
					size="sm"
					className="flex flex-col gap-2"
				>
					<SubscriptionCard
						{...subscription}
						onRenew={() =>
							console.log('Renew subscription', subscription.id)
						}
					/>
				</SDKWrapper>
			))}

			{loggedIn && subscriptions.length === 0 && !isLoading && (
				<p className="body-2 text-neutral-strong text-center py-8">
					No subscriptions found.
				</p>
			)}

			{loggedIn && (pagination.hasNextPage || pagination.hasPrevPage) && (
				<div className="flex items-center justify-center gap-4 pt-4">
					<Button
						theme="accent"
						variant="outline"
						size="sm"
						onClick={pagination.prevPage}
						disabled={!pagination.hasPrevPage}
					>
						<ChevronLeft className="size-4" />
						Previous
					</Button>
					<span className="caption text-neutral-strong">
						Page {pagination.page} of {pagination.totalPages}
					</span>
					<Button
						theme="accent"
						variant="outline"
						size="sm"
						onClick={pagination.nextPage}
						disabled={!pagination.hasNextPage}
					>
						Next
						<ChevronRight className="size-4" />
					</Button>
				</div>
			)}
		</div>
	);
};
