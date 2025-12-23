'use client';

import { Button } from '@/components/shadcn/ui/button';
import { ProfileNavigation } from '@/modules/profile/components/profile-navigation';
import { ProfileSidebar } from '@/modules/profile/components/profile-sidebar';
import { CheckCircle2, Info, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState, type FC } from 'react';
import type { NewsletterCategory } from '../components/newsletter-picker';
import { NewsletterPicker } from '../components/newsletter-picker';

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

type LoginState = 'logged-in' | 'logged-out' | 'link-sent' | 'expired';

export const NewsletterPage: FC = () => {
	const [loginState, setLoginState] = useState<LoginState>('logged-out');
	const [email, setEmail] = useState('matija@unidy.de');
	const [selectedIds, setSelectedIds] = useState<string[]>(['player-news']);

	const handleLogin = () => {
		setLoginState('link-sent');
		setTimeout(() => {
			setLoginState('logged-in');
		}, 3000);
	};

	const handleSave = () => {
		console.log('Saving preferences:', selectedIds);
	};

	const handleUnsubscribeAll = () => {
		setSelectedIds([]);
	};

	const isLoggedIn = loginState === 'logged-in';
	const isFrozen = loginState === 'expired' || loginState === 'logged-out';

	return (
		<div className="bg-background min-h-screen flex flex-col">
			<ProfileNavigation>
				{isLoggedIn ? (
					<div className="flex gap-2 items-center">
						<div className="bg-neutral-weak rounded-[10px] h-10 px-4 flex items-center w-[240px]">
							<p className="body-2 text-neutral-strong">{email}</p>
						</div>
						<Link href="/login">
							<Button theme="accent" variant="solid" size="md">
								Go to Profile
							</Button>
						</Link>
					</div>
				) : (
					<Button
						theme="neutral"
						variant="solid"
						size="md"
						onClick={handleLogin}
					>
						Log in
					</Button>
				)}
			</ProfileNavigation>

			<div className="flex-1 flex justify-center py-6 lg:py-10">
				<div className="max-w-[1200px] w-full px-2 lg:px-6 flex flex-col md:flex-row gap-6 lg:gap-10">
					<ProfileSidebar
						userName={isLoggedIn ? 'John Doe' : 'Signed out'}
						userInitials={isLoggedIn ? 'JD' : ''}
						memberSince={isLoggedIn ? '2020' : undefined}
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
										disabled={isFrozen}
										className="flex-1 input text-neutral-medium bg-transparent border-0 outline-0 placeholder:text-neutral-medium"
									/>
								</div>
								<Button
									theme="neutral"
									variant="solid-weak"
									size="md"
									className="w-full"
									onClick={handleLogin}
									disabled={isFrozen}
								>
									Log in
								</Button>
							</div>
						)}
						{isLoggedIn && (
							<Link href="/login" className="w-full mt-6">
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
						{/* Profile Preferences Section */}
						{/* <div className="bg-section border border-neutral-weak rounded-[12px] p-10 flex flex-col gap-6">
							<div className="flex flex-col gap-1">
								<h2 className="title-2 text-neutral">Profile Preferences</h2>
								<p className="body-2 text-neutral-strong">
									Manage your personal details here.
								</p>
							</div>

							{isFrozen ? (
								<div className="flex flex-col gap-6">
									<div className="bg-neutral-weak border border-neutral-medium rounded-[10px] p-4 flex gap-4 items-start">
										<Info className="size-6 text-neutral-strong shrink-0" />
										<p className="body-2 text-neutral-strong">
											Please sign in to view newsletter preferences.
										</p>
									</div>
									<Button
										theme="neutral"
										variant="solid-weak"
										size="md"
										disabled
									>
										Save Changes
									</Button>
								</div>
							) : (
								<div className="flex flex-col gap-6">
									<div className="flex flex-col gap-6">
										<FormLabel title="Email Address" required>
											<InputGroup className="border-neutral-medium rounded-[10px] h-10 px-4">
												<InputGroupInput
													type="email"
													value={email}
													disabled
													className="text-neutral"
												/>
											</InputGroup>
										</FormLabel>
										<div className="flex gap-3">
											<FormLabel title="First Name" required className="flex-1">
												<InputGroup className="border-neutral-medium rounded-[10px] h-10 px-4">
													<InputGroupInput
														type="text"
														value="Matija"
														disabled
														className="text-neutral"
													/>
												</InputGroup>
											</FormLabel>
											<FormLabel title="Last Name" required className="flex-1">
												<InputGroup className="border-neutral-medium rounded-[10px] h-10 px-4">
													<InputGroupInput
														type="text"
														value="Fucek"
														disabled
														className="text-neutral"
													/>
												</InputGroup>
											</FormLabel>
										</div>
									</div>
									<Button theme="accent" variant="solid" size="md">
										Save Changes
									</Button>
								</div>
							)}
						</div> */}

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
									{isFrozen ? (
										<div className="bg-neutral-weak border border-neutral-medium rounded-[10px] p-4 flex gap-4 items-start">
											<Info className="size-6 text-neutral-strong shrink-0" />
											<p className="body-2 text-neutral-strong">
												Please sign in to view newsletter preferences.
											</p>
										</div>
									) : (
										<NewsletterPicker
											categories={newsletterCategories}
											selectedIds={selectedIds}
											onChange={setSelectedIds}
											disabled={!isLoggedIn}
										/>
									)}
								</div>

								<div className="flex gap-4">
									<Button
										theme="accent"
										variant="solid"
										size="md"
										onClick={handleSave}
										disabled={!isLoggedIn || isFrozen}
									>
										Save Preferences
									</Button>
									<Button
										theme="neutral"
										variant="outline"
										size="md"
										onClick={handleUnsubscribeAll}
										disabled={!isLoggedIn || isFrozen}
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
			{loginState === 'link-sent' && (
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
