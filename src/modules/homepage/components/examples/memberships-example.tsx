'use client';

import {
	type Subscription,
	usePagination,
	useSession,
	useTicketables
} from '@unidy.io/sdk-react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/shadcn/ui/button';
import { fetchCallbackOptions } from '@/deps/unidy/callbacks';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';
import type { StatusFilterValue } from '@/modules/tickets/components/status-filter';
import {
	SubscriptionCard,
	type SubscriptionCardProps
} from '@/modules/tickets/components/subscription-card';
import { formatDate, formatPrice, mapItemState } from '@/modules/tickets/utils';

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

export const MembershipsExample = ({
	statusFilter,
	perPage = 4
}: {
	statusFilter?: StatusFilterValue;
	perPage?: number;
}) => {
	const [mounted, setMounted] = useState(false);
	const { isAuthenticated } = useSession();
	const pagination = usePagination({ perPage });
	const { items, isLoading } = useTicketables({
		type: 'subscription',
		pagination,
		filter: {
			orderBy: 'starts_at',
			orderDirection: 'desc',
			...(statusFilter ? { state: statusFilter } : {})
		},
		fetchOnMount: isAuthenticated,
		callbacks: fetchCallbackOptions
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	const loggedIn = mounted && isAuthenticated;

	const subscriptions = loggedIn
		? items.map(mapSubscriptionToCardProps)
		: fallbackSubscriptions;

	return (
		<div className="relative flex flex-col gap-2 w-full">
			{loggedIn && isLoading && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 rounded-lg">
					<Loader2 className="size-6 animate-spin text-neutral-strong" />
				</div>
			)}
			{subscriptions.map((subscription) => (
				<SDKWrapper
					key={subscription.id}
					title="Tickets SDK / Subscription Card"
					codeSnippet={`const { items } = useTicketables({
  type: 'subscription',
  pagination,
  filter: { orderBy: 'starts_at', orderDirection: 'desc' },
  callbacks: fetchCallbackOptions,
});`}
					size="sm"
					className="flex flex-col gap-2"
				>
					<SubscriptionCard
						{...subscription}
						onRenew={() => console.log('Renew subscription', subscription.id)}
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
