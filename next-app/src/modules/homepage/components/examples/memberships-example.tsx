'use client';

import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';
import {
	SubscriptionCard,
	SubscriptionCardProps
} from '@/modules/tickets/components/subscription-card';

const subscriptions: (SubscriptionCardProps & { id: string })[] = [
	{
		id: 'sub-001',
		title: 'Season Ticket 2024/25',
		subtitle: 'Season Pass',
		status: 'active' as const,
		validUntil: '30/05/2025',
		remainingMatches: '12 matches',
		benefits: [
			'Priority seating',
			'Exclusive merchandise discount',
			'Early ticket access'
		],
		annualPrice: '$850'
	}
];

export const MembershipsExample = () => {
	return (
		<div className="flex flex-col gap-2 w-full">
			{subscriptions.map((subscription) => (
				<SDKWrapper
					key={subscription.id}
					title="Tickets SDK / Subscription Card"
					codeSnippet={`<SubscriptionCard subscription={subscription} />`}
					size="sm"
					className="flex flex-col gap-2"
				>
					<SubscriptionCard
						{...subscription}
						onRenew={() => console.log('Renew subscription', subscription.id)}
					/>
				</SDKWrapper>
			))}
		</div>
	);
};
