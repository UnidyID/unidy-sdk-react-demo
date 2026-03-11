'use client';

import { Button } from '@/components/shadcn/ui/button';
import { toastCallbacks } from '@/deps/unidy/callbacks';
import {
	TicketCard,
	TicketCardProps
} from '@/modules/tickets/components/ticket-card';
import {
	formatDate,
	formatPrice,
	formatTime,
	mapItemState
} from '@/modules/tickets/utils';
import {
	usePagination,
	useTicketables,
	type Ticket
} from '@unidy.io/sdk-react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { FC } from 'react';

function mapTicketToCardProps(
	ticket: Ticket
): TicketCardProps & { id: string } {
	return {
		id: ticket.id,
		title: ticket.title,
		ticketId: ticket.reference,
		price: formatPrice(ticket.price, ticket.currency),
		status: mapItemState(ticket.state),
		date: formatDate(ticket.starts_at),
		time: formatTime(ticket.starts_at),
		venue: ticket.venue ?? 'TBA',
		seat: ticket.seating ?? undefined
	};
}

export const ProfileTicketsPage: FC = () => {
	const pagination = usePagination({ perPage: 10 });
	const { items, isLoading, getExportLink } = useTicketables({
		type: 'ticket',
		pagination,
		filter: { orderBy: 'starts_at', orderDirection: 'desc' },
		fetchOnMount: true,
		callbacks: toastCallbacks
	});

	const handleDownload = async (ticketId: string) => {
		const result = await getExportLink(ticketId, 'pdf');
		if (result?.url) {
			window.open(result.url, '_blank');
		}
	};

	const tickets = items.map(mapTicketToCardProps);

	return (
		<div className="flex flex-col gap-6 grow">
			<div className="bg-section border border-neutral-weak rounded-[12px] p-10 flex flex-col gap-6 grow">
				<div className="flex items-start justify-between">
					<div className="flex flex-col gap-1">
						<h2 className="title-2 text-neutral">My Tickets</h2>
						<p className="body-2 text-neutral-strong">
							View and manage your event tickets.
						</p>
					</div>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="size-6 animate-spin text-neutral-strong" />
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{tickets.map((ticket) => (
							<TicketCard
								key={ticket.id}
								{...ticket}
								onDownload={() => handleDownload(ticket.id)}
							/>
						))}

						{tickets.length === 0 && (
							<p className="body-2 text-neutral-strong text-center py-8">
								No tickets found.
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
