'use client';

import { Button } from '@/components/shadcn/ui/button';
import type { NewsletterCategory } from '@/modules/newsletter/components/newsletter-picker';
import { NewsletterPicker } from '@/modules/newsletter/components/newsletter-picker';
import { useState, type FC } from 'react';

const newsletterCategories: NewsletterCategory[] = [
	{
		id: 'sports',
		name: 'Sports Newsletter',
		description:
			'Manage your email subscriptions and choose what content you want to receive from FC Unidy.',
		options: [
			{
				id: 'match-updates',
				title: 'Match Updates & Results',
				description:
					'Get live scores, match highlights, and post-game analysis',
				icon: 'trophy',
				category: 'sports'
			},
			{
				id: 'player-news',
				title: 'Player News',
				description:
					'Transfer updates, injury reports, and exclusive player interviews',
				icon: 'users',
				category: 'sports'
			}
		]
	},
	{
		id: 'shop',
		name: 'Shop Newsletter',
		description:
			'Manage your email subscriptions and choose what content you want to receive from FC Unidy.',
		options: [
			{
				id: 'shop-offers',
				title: 'Shop Offers & Merchandise',
				description: 'Exclusive discounts and early access to new merchandise',
				icon: 'trophy',
				category: 'shop'
			}
		]
	},
	{
		id: 'club',
		name: 'Club Newsletter',
		description:
			'Manage your email subscriptions and choose what content you want to receive from FC Unidy.',
		options: [
			{
				id: 'club-updates',
				title: 'General Club Updates',
				description: 'Club announcements, events, and community news',
				icon: 'bell',
				category: 'club'
			}
		]
	}
];

export const ProfileNewsletterPage: FC = () => {
	const [selectedIds, setSelectedIds] = useState<string[]>(['player-news']);

	const handleSave = () => {
		console.log('Saving preferences:', selectedIds);
	};

	const handleUnsubscribeAll = () => {
		setSelectedIds([]);
	};

	return (
		<div className="flex flex-col gap-6 grow">
			<div className="bg-section border border-neutral-weak rounded-[12px] p-10 flex flex-col gap-6 grow">
				<div className="flex flex-col gap-1">
					<h2 className="title-2 text-neutral">Newsletter Preferences</h2>
					<p className="body-2 text-neutral-strong">
						Manage your email subscriptions and choose what content you want to
						receive from FC Unidy.
					</p>
				</div>

				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-3">
						<p className="title-3 text-neutral-strong">
							Subscribed Newsletters
						</p>
						<NewsletterPicker
							categories={newsletterCategories}
							selectedIds={selectedIds}
							onChange={setSelectedIds}
						/>
					</div>

					<div className="flex gap-4">
						<Button
							theme="accent"
							variant="solid"
							size="md"
							onClick={handleSave}
						>
							Save Preferences
						</Button>
						<Button
							theme="neutral"
							variant="outline"
							size="md"
							onClick={handleUnsubscribeAll}
						>
							Unsubscribe from All
						</Button>
					</div>

					<div className="bg-neutral-weak border border-neutral-medium rounded-[10px] p-4 flex flex-col gap-2">
						<p className="body-2 text-neutral-strong font-bold">Need help?</p>
						<p className="body-2 text-neutral-strong">
							You can update these preferences at any time by visiting this page
							or clicking the preferences link in any of our emails.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
