'use client';

import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/shadcn/ui/button';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/components/shadcn/ui/tabs';
import { Code } from 'lucide-react';
import { MembershipsExample } from '../examples/memberships-example';
import { TicketsExample } from '../examples/tickets-example';

export const TicketsSection = () => {
	return (
		<section
			className="bg-background flex flex-col items-center px-6 py-20 w-full"
			id="tickets"
		>
			<div className="flex flex-col gap-12 items-start max-w-[1024px] w-full">
				{/* Section Heading */}
				<div className="flex flex-col gap-6 flex-1 min-w-0 w-full">
					<SectionHeading
						title="Tickets & Subscriptions"
						description="View and manage your event tickets, memberships, and active subscriptions."
					>
						<Button theme="accent" variant="ghost" size="sm" className="w-fit">
							<Code className="size-4" />
							View Integration Code
						</Button>
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
					<TabsContent value="tickets" className="mt-12 flex-1 min-w-0 w-full">
						<TicketsExample />
					</TabsContent>

					{/* Subscriptions & Memberships Tab */}
					<TabsContent value="subscriptions" className="mt-12">
						<MembershipsExample />
					</TabsContent>
				</Tabs>
			</div>
		</section>
	);
};
