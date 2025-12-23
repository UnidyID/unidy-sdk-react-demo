'use client';

import { SDKElement } from '@/modules/sdk-element/components/sdk-element';
import {
	TicketCard,
	TicketCardProps
} from '@/modules/tickets/components/ticket-card';

const tickets: (TicketCardProps & { id: string })[] = [
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

export const TicketsExample = () => {
	return (
		<div className="flex flex-col gap-2 w-full">
			{tickets.map((ticket, index) => (
				<div key={ticket.id} className="relative">
					<SDKElement
						title="Tickets SDK / Ticket Card"
						codeSnippet={`<TicketCard ticket={ticket} />`}
						size="sm"
					/>
					<TicketCard
						{...ticket}
						onDownload={() => console.log('Download ticket', ticket.id)}
					/>
				</div>
			))}
		</div>
	);
};
