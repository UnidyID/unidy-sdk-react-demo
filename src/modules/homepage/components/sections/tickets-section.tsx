'use client';

import { useSession } from '@unidy.io/sdk-react';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/card';
import { IntegrationCode } from '@/components/integration-code';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/shadcn/ui/button';
import {
	StatusFilter,
	type StatusFilterValue
} from '@/modules/tickets/components/status-filter';
import { LoggedOutPlaceholder } from '../examples/logged-out-placeholder';
import { TicketsExample } from '../examples/tickets-example';

const integrationCode = `import {
  useSession,
  usePagination,
  useTicketables,
} from '@unidy.io/sdk-react';

const { isAuthenticated } = useSession();
const pagination = usePagination({ perPage: 10 });
const { items, isLoading, getExportLink } = useTicketables({
  type: 'ticket',
  pagination,
  filter: { orderBy: 'starts_at', orderDirection: 'desc' },
  fetchOnMount: isAuthenticated,
});

// Download ticket as PDF
const link = await getExportLink(ticket.id, 'pdf');
window.open(link.url, '_blank');

// Add ticket to Apple Wallet
const walletLink = await getExportLink(ticket.id, 'pkpass');
window.open(walletLink.url, '_blank');`;

export const TicketsSection = () => {
	const [mounted, setMounted] = useState(false);
	const session = useSession();

	useEffect(() => {
		setMounted(true);
	}, []);

	const searchParams = useSearchParams();
	const perPage = Number(searchParams.get('per_page')) || 4;
	const isLoggedIn = mounted && session.isAuthenticated;
	const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('');

	return (
		<section
			className="bg-background flex flex-col items-center px-6 py-20 w-full"
			id="tickets"
		>
			<div className="flex flex-col gap-12 items-start max-w-[1024px] w-full">
				{/* Section Heading */}
				<div className="flex flex-col gap-6 flex-1 min-w-0 w-full">
					<SectionHeading
						title="Event Tickets"
						description="View and manage your event tickets."
					>
						<IntegrationCode code={integrationCode} language="typescript" />
					</SectionHeading>
				</div>

				{/* Content */}
				<div className="flex flex-col gap-4 w-full">
					{isLoggedIn && (
						<div className="flex md:justify-end">
							<StatusFilter value={statusFilter} onChange={setStatusFilter} />
						</div>
					)}

					{isLoggedIn ? (
						<>
							<TicketsExample statusFilter={statusFilter} perPage={perPage} />
							<div className="flex justify-center pt-6">
								<Link href="/profile/tickets">
									<Button theme="accent" variant="outline" size="md">
										<ExternalLink className="size-4" />
										View All Tickets
									</Button>
								</Link>
							</div>
						</>
					) : (
						<Card className="mt-6">
							<LoggedOutPlaceholder message="Please log in to see your list of events and tickets." />
						</Card>
					)}
				</div>
			</div>
		</section>
	);
};
