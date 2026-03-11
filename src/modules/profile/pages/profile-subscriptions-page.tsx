'use client';

import {
	type Subscription,
	usePagination,
	useTicketables
} from '@unidy.io/sdk-react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { type FC, useState } from 'react';
import { Button } from '@/components/shadcn/ui/button';
import { fetchCallbackOptions } from '@/deps/unidy/callbacks';
import {
	StatusFilter,
	type StatusFilterValue
} from '@/modules/tickets/components/status-filter';
import {
	SubscriptionCard,
	type SubscriptionCardProps
} from '@/modules/tickets/components/subscription-card';
import { formatDate, formatPrice, mapItemState } from '@/modules/tickets/utils';

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
		annualPrice: formatPrice(subscription.price, subscription.currency),
		exportable: subscription.exportable_to_wallet
	};
}

export const ProfileSubscriptionsPage: FC = () => {
	const searchParams = useSearchParams();
	const perPage = Number(searchParams.get('per_page')) || 4;
	const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('');
	const pagination = usePagination({ perPage });
	const { items, isLoading, getExportLink } = useTicketables({
		type: 'subscription',
		pagination,
		filter: {
			orderBy: 'starts_at',
			orderDirection: 'desc',
			...(statusFilter ? { state: statusFilter } : {})
		},
		fetchOnMount: true,
		callbacks: fetchCallbackOptions
	});

	const handleExport = async (
		subscriptionId: string,
		format: 'pdf' | 'pkpass'
	) => {
		const result = await getExportLink(subscriptionId, format);
		if (result?.url) {
			window.open(result.url, '_blank');
		}
	};

	const subscriptions = items.map(mapSubscriptionToCardProps);

	return (
		<div className="flex flex-col gap-6 grow">
			<div className="bg-section border border-neutral-weak rounded-[12px] p-10 flex flex-col gap-6 grow">
				<div className="flex items-start justify-between">
					<div className="flex flex-col gap-1">
						<h2 className="title-2 text-neutral">My Subscriptions</h2>
						<p className="body-2 text-neutral-strong">
							View and manage your subscriptions.
						</p>
					</div>
					<StatusFilter value={statusFilter} onChange={setStatusFilter} />
				</div>

				<div className="relative flex flex-col gap-2">
					{isLoading && (
						<div className="absolute inset-0 z-10 flex items-center justify-center bg-section/50 rounded-lg">
							<Loader2 className="size-6 animate-spin text-neutral-strong" />
						</div>
					)}
					{subscriptions.map((subscription) => (
						<SubscriptionCard
							key={subscription.id}
							{...subscription}
							onDownloadPdf={() => handleExport(subscription.id, 'pdf')}
							onDownloadPkpass={() => handleExport(subscription.id, 'pkpass')}
						/>
					))}

					{subscriptions.length === 0 && !isLoading && (
						<p className="body-2 text-neutral-strong text-center py-8">
							No subscriptions found.
						</p>
					)}
				</div>

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
