'use client';

import { useSession } from '@unidy.io/sdk-react';
import Link from 'next/link';
import type { FC } from 'react';
import { Button } from '@/components/shadcn/ui/button';
import {
	buildLoginHref,
	useCurrentReturnTo
} from '@/modules/authentication/utils/return-to';
import { ProfileNavigation } from '@/modules/profile/components/profile-navigation';
import { ProfileSidebar } from '@/modules/profile/components/profile-sidebar';
import { NewsletterSubscriptionShowcase } from '../components/newsletter-subscription-showcase';

export const NewsletterPage: FC = () => {
	const session = useSession();
	const isLoggedIn = session.isAuthenticated;
	const returnTo = useCurrentReturnTo('/newsletter');

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
					<Link href={buildLoginHref(returnTo, '/newsletter')}>
						<Button theme="neutral" variant="solid" size="md">
							Log in
						</Button>
					</Link>
				)}
			</ProfileNavigation>

			<div className="flex-1 flex justify-center py-6 lg:py-10">
				<div className="max-w-[1200px] w-full px-2 lg:px-6 flex flex-col md:flex-row gap-6 lg:gap-10">
					<ProfileSidebar
						userName={isLoggedIn ? session.email || 'Subscriber' : 'Newsletter'}
						userInitials={
							isLoggedIn ? session.email?.[0]?.toUpperCase() || 'N' : ''
						}
						memberSince={undefined}
						statusText={
							isLoggedIn
								? 'Manage your newsletter preferences'
								: 'Sign in to manage your newsletter preferences'
						}
						showNavigation={false}
					>
						<div className="bg-neutral-weak border border-neutral-medium rounded-[10px] p-4 flex flex-col gap-3 mt-6">
							<p className="body-2 text-neutral-strong font-bold">
								Already subscribed?
							</p>
							<p className="body-2 text-neutral-strong">
								Click here to manage your newsletter.
							</p>
							<Link href="/newsletter/manage" className="w-full">
								<Button
									theme="accent"
									variant="solid"
									size="md"
									className="w-full"
								>
									Manage Newsletter
								</Button>
							</Link>
						</div>
					</ProfileSidebar>

					<div className="flex-1 min-w-0 flex flex-col gap-6">
						<div className="bg-section border border-neutral-weak rounded-[12px] p-6 lg:p-10">
							<NewsletterSubscriptionShowcase
								className="gap-8 lg:gap-12"
								showSidebarCopy={false}
								showCardTitle
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
