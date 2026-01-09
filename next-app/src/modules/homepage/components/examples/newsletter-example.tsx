'use client';

import { CardSelect } from '@/components/card-select';
import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';
import { Bell, Mail, Trophy, Users } from 'lucide-react';
import { useState } from 'react';

const newsletters = [
	{
		id: 'match-updates',
		icon: <Trophy className="size-5 text-neutral-strong" />,
		title: 'Match Updates & Results',
		description: 'Get live scores, match highlights, and post-game analysis'
	},
	{
		id: 'player-news',
		icon: <Users className="size-5 text-neutral-strong" />,
		title: 'Player News',
		description:
			'Transfer updates, injury reports, and exclusive player interviews'
	},
	{
		id: 'shop-offers',
		icon: <Trophy className="size-5 text-neutral-strong" />,
		title: 'Shop Offers & Merchandise',
		description: 'Exclusive discounts and early access to new merchandise'
	},
	{
		id: 'club-updates',
		icon: <Bell className="size-5 text-neutral-strong" />,
		title: 'General Club Updates',
		description: 'Club announcements, events, and community news'
	}
];

export const NewsletterExample = () => {
	const [selectedNewsletters, setSelectedNewsletters] = useState<string[]>([]);

	const toggleNewsletter = (id: string) => {
		setSelectedNewsletters((prev) =>
			prev.includes(id)
				? prev.filter((newsletterId) => newsletterId !== id)
				: [...prev, id]
		);
	};

	return (
		<SDKWrapper
			title="Newsletter SDK / Subscription Form"
			codeSnippet="<NewsletterForm />"
			size="lg"
			labelPosition="top-left"
			detatched
			popoverPosition="right"
		>
			<div className="flex flex-col gap-6 w-full">
				{/* Email Input */}
				<div className="flex flex-col gap-2 relative">
					<FormLabel title="Email Address" required>
						<SDKWrapper
							title="Newsletter SDK / Email Input"
							codeSnippet="<input type='email' />"
							size="sm"
							labelPosition="bottom-right"
							popoverPosition="right"
							className="relative border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4 bg-section"
						>
							<Mail className="size-5 text-neutral-medium shrink-0" />
							<input
								type="email"
								placeholder="john.doe@example.com"
								className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
							/>
						</SDKWrapper>
					</FormLabel>
				</div>

				{/* Newsletter Selection */}
				<FormLabel title="Select Newsletters" required>
					<div className="flex flex-col gap-3 w-full">
						{newsletters.map((newsletter) => (
							<CardSelect
								key={newsletter.id}
								icon={newsletter.icon}
								title={newsletter.title}
								description={newsletter.description}
								selected={selectedNewsletters.includes(newsletter.id)}
								onClick={() => toggleNewsletter(newsletter.id)}
							/>
						))}
					</div>
				</FormLabel>

				{/* Submit Button */}
				<SDKWrapper
					title="Newsletter SDK / Submit"
					codeSnippet="<button type='submit'>Subscribe</button>"
					size="sm"
					popoverPosition="right"
				>
					<Button theme="accent" variant="solid" size="lg" className="w-full">
						Subscribe to Selected Newsletters
					</Button>
				</SDKWrapper>
			</div>
		</SDKWrapper>
	);
};
