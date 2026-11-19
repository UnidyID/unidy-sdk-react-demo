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
import { MembershipsExample } from '../examples/memberships-example';

const integrationCode = `import {
  useSession,
  usePagination,
  useTicketables,
} from '@unidy.io/sdk-react';

const { isAuthenticated } = useSession();
const pagination = usePagination({ perPage: 10 });
const { items: subscriptions, getExportLink } = useTicketables({
  type: 'subscription',
  pagination,
  filter: { orderBy: 'starts_at', orderDirection: 'desc' },
  fetchOnMount: isAuthenticated,
});

// Add subscription to Apple Wallet
const walletLink = await getExportLink(subscription.id, 'pkpass');
window.open(walletLink.url, '_blank');`;

export const SubscriptionsSection = () => {
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
			className="bg-section flex flex-col items-center px-6 py-20 w-full"
			id="subscriptions"
		>
			<div className="flex flex-col gap-12 items-start max-w-[1024px] w-full">
				{/* Section Heading */}
				<div className="flex flex-col gap-6 flex-1 min-w-0 w-full">
					<SectionHeading
						title="Subscriptions & Memberships"
						description="View and manage your memberships and active subscriptions."
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
							<MembershipsExample
								statusFilter={statusFilter}
								perPage={perPage}
							/>
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
				</div>
			</div>
		</section>
	);
};
