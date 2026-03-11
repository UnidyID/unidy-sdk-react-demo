'use client';

import {
	type Ticket,
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
	TicketCard,
	type TicketCardProps
} from '@/modules/tickets/components/ticket-card';
import {
	formatDate,
	formatPrice,
	formatTime,
	mapItemState
} from '@/modules/tickets/utils';

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
		seat: ticket.seating ?? undefined,
		exportable: ticket.exportable_to_wallet
	};
}

export const TicketsExample = ({
	statusFilter,
	perPage = 4
}: {
	statusFilter?: StatusFilterValue;
	perPage?: number;
}) => {
	const [mounted, setMounted] = useState(false);
	const { isAuthenticated } = useSession();
	const pagination = usePagination({ perPage });

	useEffect(() => {
		setMounted(true);
	}, []);
	const { items, isLoading, getExportLink } = useTicketables({
		type: 'ticket',
		pagination,
		filter: {
			orderBy: 'starts_at',
			orderDirection: 'desc',
			...(statusFilter ? { state: statusFilter } : {})
		},
		fetchOnMount: isAuthenticated,
		callbacks: fetchCallbackOptions
	});

	const handleDownload = async (ticketId: string) => {
		const result = await getExportLink(ticketId, 'pdf');
		if (result?.url) {
			window.open(result.url, '_blank');
		}
	};

	const loggedIn = mounted && isAuthenticated;

	const tickets = loggedIn ? items.map(mapTicketToCardProps) : fallbackTickets;

	return (
		<div className="relative flex flex-col gap-2 w-full">
			{loggedIn && isLoading && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 rounded-lg">
					<Loader2 className="size-6 animate-spin text-neutral-strong" />
				</div>
			)}
			{tickets.map((ticket) => (
				<SDKWrapper
					key={ticket.id}
					title="Tickets SDK / Ticket Card"
					codeSnippet={`const { items, getExportLink } = useTicketables({
  type: 'ticket',
  pagination,
  filter: { orderBy: 'starts_at', orderDirection: 'desc' },
  callbacks: fetchCallbackOptions,
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
