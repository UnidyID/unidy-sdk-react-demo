'use client';

import { Button } from '@/components/shadcn/ui/button';
import { toastCallbacks } from '@/deps/unidy/callbacks';
import {
	SubscriptionCard,
	SubscriptionCardProps
} from '@/modules/tickets/components/subscription-card';
import { formatDate, formatPrice, mapItemState } from '@/modules/tickets/utils';
import {
	usePagination,
	useTicketables,
	type Subscription
} from '@unidy.io/sdk-react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { type FC } from 'react';

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

export const ProfileSubscriptionsPage: FC = () => {
	const pagination = usePagination({ perPage: 10 });
	const { items, isLoading } = useTicketables({
		type: 'subscription',
		pagination,
		filter: { orderBy: 'starts_at', orderDirection: 'desc' },
		fetchOnMount: true,
		callbacks: toastCallbacks
	});

	const subscriptions = items.map(mapSubscriptionToCardProps);

	return (
		<div className="flex flex-col gap-6 grow">
			<div className="bg-section border border-neutral-weak rounded-[12px] p-10 flex flex-col gap-6 grow">
				<div className="flex flex-col gap-1">
					<h2 className="title-2 text-neutral">My Subscriptions</h2>
					<p className="body-2 text-neutral-strong">
						View and manage your subscriptions.
					</p>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="size-6 animate-spin text-neutral-strong" />
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{subscriptions.map((subscription) => (
							<SubscriptionCard
								key={subscription.id}
								{...subscription}
								onRenew={() =>
									console.log('Renew subscription', subscription.id)
								}
							/>
						))}

						{subscriptions.length === 0 && (
							<p className="body-2 text-neutral-strong text-center py-8">
								No subscriptions found.
							</p>
						)}
					</div>
				)}

				{(pagination.hasNextPage || pagination.hasPrevPage) && (
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
		</div>
	);
};
