'use client';

import { Button } from '@/components/shadcn/ui/button';
import { toastCallbacks } from '@/deps/unidy/callbacks';
import {
	TicketCard,
	TicketCardProps
} from '@/modules/tickets/components/ticket-card';
import { formatDate, formatPrice, formatTime, mapItemState } from '@/modules/tickets/utils';
import {
	usePagination,
	useTicketables,
	type Ticket
} from '@unidy.io/sdk-react';
import { ChevronLeft, ChevronRight, Loader2, Plus } from 'lucide-react';
import { type FC, useState } from 'react';

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

const matchups = [
	['FC Unidy', 'Unidy United'],
	['FC Unidy', 'Real Identidad'],
	['FC Unidy', 'AC Authen'],
	['FC Unidy', 'SSO Rovers'],
	['FC Unidy', 'Dynamo Token']
];
const venues = ['Unidy Stadium', 'Identity Arena', 'Auth Park', 'Token Grounds'];
const blocks = ['North Stand - Block A', 'South Stand - Block B', 'East Wing - Block C', 'West Wing - Block D'];

function randomPlaceholderTicket(): TicketCardProps & { id: string } {
	const matchup = matchups[Math.floor(Math.random() * matchups.length)]!;
	const [home, away] = matchup;
	const venue = venues[Math.floor(Math.random() * venues.length)]!;
	const block = blocks[Math.floor(Math.random() * blocks.length)]!;
	const row = Math.floor(Math.random() * 30) + 1;
	const seatNum = Math.floor(Math.random() * 60) + 1;
	const price = Math.floor(Math.random() * 150) + 20;
	const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
	const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
	const hour = Math.floor(Math.random() * 5) + 17;

	return {
		id: `placeholder-${crypto.randomUUID()}`,
		title: `${home} vs ${away}`,
		ticketId: `TKT-${String(Math.floor(Math.random() * 9000) + 1000)}`,
		price: `$${price}`,
		status: 'active',
		date: `${day}/${month}/2025`,
		time: `${hour}:00`,
		venue,
		venueDetails: block,
		seat: `Row ${row}, Seat ${seatNum}`
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

	const [placeholderTickets, setPlaceholderTickets] = useState<
		(TicketCardProps & { id: string })[]
	>([]);

	const handleDownload = async (ticketId: string) => {
		const result = await getExportLink(ticketId, 'pdf');
		if (result?.url) {
			window.open(result.url, '_blank');
		}
	};

	const handleAddTicket = () => {
		setPlaceholderTickets((prev) => [randomPlaceholderTicket(), ...prev]);
	};

	const apiTickets = items.map(mapTicketToCardProps);
	const allTickets = [...placeholderTickets, ...apiTickets];

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
					<Button theme="accent" size="sm" onClick={handleAddTicket}>
						<Plus className="size-4" />
						Add Ticket
					</Button>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="size-6 animate-spin text-neutral-strong" />
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{allTickets.map((ticket) => (
							<TicketCard
								key={ticket.id}
								{...ticket}
								onDownload={
									ticket.id.startsWith('placeholder-')
										? undefined
										: () => handleDownload(ticket.id)
								}
							/>
						))}

						{allTickets.length === 0 && (
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
