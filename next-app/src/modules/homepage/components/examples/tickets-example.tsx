'use client';

import { toastCallbacks } from '@/deps/unidy/callbacks';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';
import {
	TicketCard,
	TicketCardProps
} from '@/modules/tickets/components/ticket-card';
import { formatDate, formatPrice, formatTime, mapItemState } from '@/modules/tickets/utils';
import {
	usePagination,
	useSession,
	useTicketables,
	type Ticket
} from '@unidy.io/sdk-react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/shadcn/ui/button';

const fallbackTickets: (TicketCardProps & { id: string })[] = [
	{
		id: 'tkt-001',
		title: 'FC Unidy vs Unidy United',
		ticketId: 'TKT-001',
		price: '$65',
		status: 'active' as const,
		date: '15/01/2025',
		time: '20:00',
		venue: 'Unidy Stadium',
		venueDetails: 'North Stand - Block A',
		seat: 'Row 12, Seat 45'
	},
	{
		id: 'tkt-002',
		title: 'FC Unidy vs Unidy United',
		ticketId: 'TKT-001',
		price: '$65',
		status: 'active' as const,
		date: '15/01/2025',
		time: '20:00',
		venue: 'Unidy Stadium',
		venueDetails: 'North Stand - Block A',
		seat: 'Row 12, Seat 45'
	}
];

function mapTicketToCardProps(ticket: Ticket): TicketCardProps & { id: string } {
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

export const TicketsExample = () => {
	const [mounted, setMounted] = useState(false);
	const { isAuthenticated } = useSession();
	const pagination = usePagination({ perPage: 10 });

	useEffect(() => {
		setMounted(true);
	}, []);
	const { items, isLoading, getExportLink } = useTicketables({
		type: 'ticket',
		pagination,
		filter: { orderBy: 'starts_at', orderDirection: 'desc' },
		fetchOnMount: isAuthenticated,
		callbacks: toastCallbacks
	});

	const handleDownload = async (ticketId: string) => {
		const result = await getExportLink(ticketId, 'pdf');
		if (result?.url) {
			window.open(result.url, '_blank');
		}
	};

	const loggedIn = mounted && isAuthenticated;

	const tickets = loggedIn
		? items.map(mapTicketToCardProps)
		: fallbackTickets;

	if (loggedIn && isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="size-6 animate-spin text-neutral-strong" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 w-full">
			{tickets.map((ticket) => (
				<SDKWrapper
					key={ticket.id}
					title="Tickets SDK / Ticket Card"
					codeSnippet={`const { items, getExportLink } = useTicketables({
  type: 'ticket',
  pagination,
  filter: { orderBy: 'starts_at', orderDirection: 'desc' },
  callbacks: toastCallbacks,
});`}
					size="sm"
				>
					<TicketCard
						{...ticket}
						onDownload={() => handleDownload(ticket.id)}
					/>
				</SDKWrapper>
			))}

			{loggedIn && tickets.length === 0 && !isLoading && (
				<p className="body-2 text-neutral-strong text-center py-8">
					No tickets found.
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
