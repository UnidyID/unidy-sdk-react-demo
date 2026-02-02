'use client';

import { CardSelect } from '@/components/card-select';
import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import { cn } from '@/components/shadcn/utils';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';
import { Bell, Check, Mail, Phone, Trophy, User, Users } from 'lucide-react';
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
	const [consentChecked, setConsentChecked] = useState(false);

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

				{/* Additional Fields */}
				<FormLabel title="Additional Fields">
					<div className="flex flex-col gap-3 w-full">
						<div className="relative border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4 bg-section">
							<User className="size-5 text-neutral-medium shrink-0" />
							<input
								type="text"
								placeholder="First Name"
								className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
							/>
						</div>
						<div className="relative border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4 bg-section">
							<User className="size-5 text-neutral-medium shrink-0" />
							<input
								type="text"
								placeholder="Last Name"
								className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
							/>
						</div>
						<div className="relative border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4 bg-section">
							<Phone className="size-5 text-neutral-medium shrink-0" />
							<input
								type="tel"
								placeholder="Phone Number"
								className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
							/>
						</div>
					</div>
				</FormLabel>

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

				{/* Consent */}
				<button
					type="button"
					onClick={() => setConsentChecked((prev) => !prev)}
					className="flex gap-3 items-start text-left"
				>
					<div
						className={cn(
							'border-2 rounded-md size-5 shrink-0 flex items-center justify-center mt-0.5 transition-all',
							consentChecked
								? 'border-neutral-strong bg-neutral-strong'
								: 'border-neutral-strong'
						)}
					>
						{consentChecked && <Check className="size-3 text-section" />}
					</div>
					<p className="body-3 text-neutral-strong">
						I want to receive the newsletter of the brand with information
						about their entertainment offers and specials via email. My data
						will not be passed along to third-persons. My consent can at any
						time be revoked via Email to info@unidy.io. I accept the data
						protection terms and terms of use.
					</p>
				</button>

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
