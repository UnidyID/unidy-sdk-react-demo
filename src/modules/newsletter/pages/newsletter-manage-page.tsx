'use client';

import { useNewsletterLogin, useSession } from '@unidy.io/sdk-react';
import { CheckCircle2, Info, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type FC, useState } from 'react';
import { Button } from '@/components/shadcn/ui/button';
import { mutationCallbackOptions } from '@/deps/unidy/callbacks';
import {
	buildLoginHref,
	useCurrentReturnTo
} from '@/modules/authentication/utils/return-to';
import { ProfileNavigation } from '@/modules/profile/components/profile-navigation';
import { ProfileSidebar } from '@/modules/profile/components/profile-sidebar';
import { NewsletterPicker } from '../components/newsletter-picker';
import { newsletterCategories } from '../constants/newsletter-data';
import { useNewsletterPreferences } from '../hooks/use-newsletter-preferences';

export const NewsletterManagePage: FC = () => {
	const searchParams = useSearchParams();
	const preferenceToken = searchParams.get('preference_token') ?? undefined;
	const returnTo = useCurrentReturnTo('/newsletter/manage');

	const session = useSession();
	const isLoggedIn = !!preferenceToken || session.isAuthenticated;

	const [email, setEmail] = useState('');

	const {
		isLoading: isLoginLoading,
		success: loginSuccess,
		sendLoginEmail
	} = useNewsletterLogin({ callbacks: mutationCallbackOptions });

	const {
		isLoading: isPreferencesLoading,
		isAnythingMutating,
		isNewsletterMutating,
		subscriptionCount,
		subscribedIds,
		subscriptionsByCategory,
		subscribeNewsletter,
		unsubscribeNewsletter,
		resendConfirmationEmail,
		togglePreference
	} = useNewsletterPreferences({
		categories: newsletterCategories,
		preferenceToken
	});
	const hasExistingNewsletters = subscriptionCount > 0;
	const confirmationReturnUrl =
		typeof window === 'undefined'
			? undefined
			: `${window.location.origin}/newsletter/manage`;

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
						<Link href="/profile/newsletter">
							<Button theme="accent" variant="solid" size="md">
								Go to Profile
							</Button>
						</Link>
					</div>
				) : (
					<Link href={buildLoginHref(returnTo, '/newsletter/manage')}>
						<Button theme="neutral" variant="solid" size="md">
							Log in
						</Button>
					</Link>
				)}
			</ProfileNavigation>

			<div className="flex-1 flex justify-center py-6 lg:py-10">
				<div className="max-w-[1200px] w-full px-2 lg:px-6 flex flex-col md:flex-row gap-6 lg:gap-10">
					<ProfileSidebar
						userName={isLoggedIn ? session.email || 'Subscriber' : 'Signed out'}
						userInitials={
							isLoggedIn ? session.email?.[0]?.toUpperCase() || 'S' : ''
						}
						memberSince={undefined}
						statusText={
							isLoggedIn
								? 'Manage your newsletter preferences'
								: 'Sign in to change preferences'
						}
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
										Newsletter Subscriptions
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
									) : !hasExistingNewsletters ? (
										<div className="bg-neutral-weak border border-neutral-medium rounded-[10px] p-6 flex flex-col gap-4">
											<div className="flex flex-col gap-1">
												<p className="title-3 text-neutral">
													No newsletters yet
												</p>
												<p className="body-2 text-neutral-strong">
													You do not have any active newsletter subscriptions to
													manage yet. Visit the subscribe page to create one.
												</p>
											</div>
											<Link href="/newsletter" className="w-fit">
												<Button theme="accent" variant="solid" size="md">
													Create a Newsletter
												</Button>
											</Link>
										</div>
									) : (
										<NewsletterPicker
											categories={newsletterCategories}
											selectedIds={subscribedIds}
											subscriptionsByCategory={subscriptionsByCategory}
											onToggle={togglePreference}
											onSubscribeNewsletter={subscribeNewsletter}
											onUnsubscribeNewsletter={unsubscribeNewsletter}
											onResendConfirmation={(internalName) =>
												void resendConfirmationEmail(
													internalName,
													confirmationReturnUrl
												)
											}
											disabled={isAnythingMutating}
											isNewsletterMutating={isNewsletterMutating}
										/>
									)}
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
