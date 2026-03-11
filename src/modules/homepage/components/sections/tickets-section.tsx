'use client';

import { Card } from '@/components/card';
import { IntegrationCode } from '@/components/integration-code';
import { SectionHeading } from '@/components/section-heading';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/components/shadcn/ui/tabs';
import { Button } from '@/components/shadcn/ui/button';
import { useSession } from '@unidy.io/sdk-react';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LoggedOutPlaceholder } from '../examples/logged-out-placeholder';
import { MembershipsExample } from '../examples/memberships-example';
import { TicketsExample } from '../examples/tickets-example';

const integrationCode = `import {
  useSession,
  usePagination,
  useTicketables,
} from '@unidy.io/sdk-react';

// Tickets
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

// Subscriptions
const { items: subscriptions } = useTicketables({
  type: 'subscription',
  pagination,
  fetchOnMount: isAuthenticated,
});`;

export const TicketsSection = () => {
	const [mounted, setMounted] = useState(false);
	const session = useSession();

	useEffect(() => {
		setMounted(true);
	}, []);

	const isLoggedIn = mounted && session.isAuthenticated;

	return (
		<section
			className="bg-background flex flex-col items-center px-6 py-20 w-full"
			id="tickets"
		>
			<div className="flex flex-col gap-12 items-start max-w-[1024px] w-full">
				{/* Section Heading */}
				<div className="flex flex-col gap-6 flex-1 min-w-0 w-full">
					<SectionHeading
						title="Tickets / Subscriptions"
						description="View and manage your event tickets, memberships, and active subscriptions."
					>
						<IntegrationCode code={integrationCode} language="typescript" />
					</SectionHeading>
				</div>

				{/* Tabs */}
				<Tabs defaultValue="tickets" className="w-full">
					<TabsList className="w-full">
						<TabsTrigger value="tickets">Event Tickets</TabsTrigger>
						<TabsTrigger value="subscriptions">
							Subscriptions & Memberships
						</TabsTrigger>
					</TabsList>

					{/* Event Tickets Tab */}
					<TabsContent value="tickets" className="flex-1 min-w-0 w-full">
						{isLoggedIn ? (
							<>
								<TicketsExample />
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
					</TabsContent>

					{/* Subscriptions & Memberships Tab */}
					<TabsContent value="subscriptions">
						{isLoggedIn ? (
							<>
								<MembershipsExample />
								<div className="flex justify-center pt-6">
									<Link href="/profile/subscriptions">
										<Button theme="accent" variant="outline" size="md">
											<ExternalLink className="size-4" />
											View All Subscriptions
										</Button>
									</Link>
								</div>
							</>
						) : (
							<Card className="mt-6">
								<LoggedOutPlaceholder message="Please log in to see your subscriptions and memberships." />
							</Card>
						)}
					</TabsContent>
				</Tabs>
			</div>
		</section>
	);
};
