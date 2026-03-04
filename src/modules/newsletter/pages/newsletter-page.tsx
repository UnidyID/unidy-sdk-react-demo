'use client';

import { Button } from '@/components/shadcn/ui/button';
import { toastCallbacks } from '@/deps/unidy/callbacks';
import { ProfileNavigation } from '@/modules/profile/components/profile-navigation';
import { ProfileSidebar } from '@/modules/profile/components/profile-sidebar';
import {
	useNewsletterLogin,
	useSession
} from '@unidy.io/sdk-react';
import { CheckCircle2, Info, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, type FC } from 'react';
import type { NewsletterCategory } from '../components/newsletter-picker';
import { NewsletterPicker } from '../components/newsletter-picker';
import { useNewsletterPreferences } from '../hooks/use-newsletter-preferences';

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

export const NewsletterPage: FC = () => {
	const searchParams = useSearchParams();
	const preferenceToken = searchParams.get('preference_token') ?? undefined;

	const session = useSession();
	const isLoggedIn = !!preferenceToken || session.isAuthenticated;

	const [email, setEmail] = useState('');

	const {
		isLoading: isLoginLoading,
		success: loginSuccess,
		sendLoginEmail
	} = useNewsletterLogin({ callbacks: toastCallbacks });

	const {
		isLoading: isPreferencesLoading,
		isAnythingMutating,
		effectiveSelectedIds,
		setSelectedIds,
		handleSave,
		handleUnsubscribeAll
	} = useNewsletterPreferences({
		categories: newsletterCategories,
		preferenceToken
	});

	const handleLogin = async () => {
		if (!email) return;
		await sendLoginEmail(email, window.location.href);
	};

	return (
		<div className="bg-background min-h-screen flex flex-col">
			<ProfileNavigation>
				{isLoggedIn ? (
					<div className="flex gap-2 items-center">
						{session.email && (
							<div className="bg-neutral-weak rounded-[10px] h-10 px-4 flex items-center w-[240px]">
								<p className="body-2 text-neutral-strong">{session.email}</p>
							</div>
						)}
						<Link href="/login">
							<Button theme="accent" variant="solid" size="md">
								Go to Profile
							</Button>
						</Link>
					</div>
				) : (
					<Link href="/login">
						<Button theme="neutral" variant="solid" size="md">
							Log in
						</Button>
					</Link>
				)}
			</ProfileNavigation>

			<div className="flex-1 flex justify-center py-6 lg:py-10">
				<div className="max-w-[1200px] w-full px-2 lg:px-6 flex flex-col md:flex-row gap-6 lg:gap-10">
					<ProfileSidebar
						userName={isLoggedIn ? (session.email || 'Subscriber') : 'Signed out'}
						userInitials={isLoggedIn ? (session.email?.[0]?.toUpperCase() || 'S') : ''}
						memberSince={isLoggedIn ? undefined : undefined}
						showNavigation={false}
					>
						{!isLoggedIn && (
							<div className="flex flex-col gap-2 mt-6">
								<div className="border border-neutral-medium rounded-[10px] h-10 px-4 flex gap-2 items-center">
									<Mail className="size-5 text-neutral-medium" />
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="email@email.com"
										className="flex-1 input text-neutral-medium bg-transparent border-0 outline-0 placeholder:text-neutral-medium"
									/>
								</div>
								<Button
									theme="neutral"
									variant="solid-weak"
									size="md"
									className="w-full"
									onClick={handleLogin}
									disabled={isLoginLoading || !email}
								>
									{isLoginLoading ? (
										<Loader2 className="size-4 animate-spin" />
									) : (
										'Log in'
									)}
								</Button>
							</div>
						)}
						{isLoggedIn && session.isAuthenticated && (
							<Link href="/profile/newsletter" className="w-full mt-6">
								<Button
									theme="accent"
									variant="solid"
									size="md"
									className="w-full"
								>
									Go to Profile
								</Button>
							</Link>
						)}
					</ProfileSidebar>

					<div className="flex-1 min-w-0 flex flex-col gap-6">
						{/* Newsletter Preferences Section */}
						<div className="bg-section border border-neutral-weak rounded-[12px] p-10 flex flex-col gap-6">
							<div className="flex flex-col gap-1">
								<h2 className="title-2 text-neutral">Newsletter Preferences</h2>
								<p className="body-2 text-neutral-strong">
									Manage your email subscriptions and choose what content you
									want to receive from FC Unidy.
								</p>
							</div>

							<div className="flex flex-col gap-6">
								<div className="flex flex-col gap-3">
									<p className="title-3 text-neutral-strong">
										Subscribed Newsletters
									</p>
									{!isLoggedIn ? (
										<div className="bg-neutral-weak border border-neutral-medium rounded-[10px] p-4 flex gap-4 items-start">
											<Info className="size-6 text-neutral-strong shrink-0" />
											<p className="body-2 text-neutral-strong">
												Please sign in to view newsletter preferences.
											</p>
										</div>
									) : isPreferencesLoading ? (
										<div className="flex items-center justify-center py-8">
											<Loader2 className="size-6 animate-spin text-neutral-strong" />
										</div>
									) : (
										<NewsletterPicker
											categories={newsletterCategories}
											selectedIds={effectiveSelectedIds}
											onChange={setSelectedIds}
											disabled={isAnythingMutating}
										/>
									)}
								</div>

								<div className="flex gap-4">
									<Button
										theme="accent"
										variant="solid"
										size="md"
										onClick={handleSave}
										disabled={!isLoggedIn || isAnythingMutating}
									>
										{isAnythingMutating ? (
											<Loader2 className="size-4 animate-spin" />
										) : null}
										Save Preferences
									</Button>
									<Button
										theme="neutral"
										variant="outline"
										size="md"
										onClick={handleUnsubscribeAll}
										disabled={!isLoggedIn || isAnythingMutating}
									>
										Unsubscribe from All
									</Button>
								</div>

								<div className="bg-neutral-weak border border-neutral-medium rounded-[10px] p-4 flex flex-col gap-2">
									<p className="body-2 text-neutral-strong font-bold">
										Need help?
									</p>
									<p className="body-2 text-neutral-strong">
										You can update these preferences at any time by visiting
										this page or clicking the preferences link in any of our
										emails.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Link Sent Notification */}
			{loginSuccess && (
				<div className="fixed bottom-[30px] right-[30px] bg-neutral rounded-[10px] p-[17px] flex gap-3 items-center w-[407px]">
					<CheckCircle2 className="size-5 text-neutral-contrast shrink-0" />
					<p className="body-2 text-neutral-contrast">
						Magic login link sent, please check your inbox!
					</p>
				</div>
			)}
		</div>
	);
};
