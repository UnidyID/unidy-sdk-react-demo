'use client';

import { toastCallbacks } from '@/lib/unidy/callbacks';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';
import {
	TicketCard,
	TicketCardProps
} from '@/modules/tickets/components/ticket-card';
import {
	usePagination,
	useSession,
	useTicketables,
	type Ticket
} from '@unidy.io/sdk-react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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

function formatPrice(price: number, currency: string | null): string {
	if (!currency) return `$${price.toFixed(2)}`;
	try {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency
		}).format(price);
	} catch {
		return `${price.toFixed(2)} ${currency}`;
	}
}

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	}).format(new Date(date));
}

function formatTime(date: Date): string {
	return new Intl.DateTimeFormat('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	}).format(new Date(date));
}

function mapTicketState(
	state: string
): 'active' | 'inactive' | 'expired' {
	switch (state.toLowerCase()) {
		case 'active':
			return 'active';
		case 'expired':
			return 'expired';
		default:
			return 'inactive';
	}
}

function mapTicketToCardProps(ticket: Ticket): TicketCardProps & { id: string } {
	return {
		id: ticket.id,
		title: ticket.title,
		ticketId: ticket.reference,
		price: formatPrice(ticket.price, ticket.currency),
		status: mapTicketState(ticket.state),
		date: formatDate(ticket.starts_at),
		time: formatTime(ticket.starts_at),
		venue: ticket.venue ?? 'TBA',
		seat: ticket.seating ?? undefined
	};
}

export const TicketsExample = () => {
	const { isAuthenticated } = useSession();
	const pagination = usePagination({ perPage: 10 });
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

	const tickets = isAuthenticated
		? items.map(mapTicketToCardProps)
		: fallbackTickets;

	if (isAuthenticated && isLoading) {
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

			{isAuthenticated && tickets.length === 0 && !isLoading && (
				<p className="body-2 text-neutral-strong text-center py-8">
					No tickets found.
				</p>
			)}

			{isAuthenticated && (pagination.hasNextPage || pagination.hasPrevPage) && (
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
