'use client';

import { Button } from '@/components/shadcn/ui/button';
import { toastCallbacks } from '@/lib/unidy/callbacks';
import { useProfile, useSession } from '@unidy.io/sdk-react';
import Link from 'next/link';
import { type FC, type PropsWithChildren } from 'react';
import { ProfileNavigation } from '../components/profile-navigation';
import { ProfileSidebar } from '../components/profile-sidebar';

export const ProfileLayout: FC<PropsWithChildren> = ({ children }) => {
	const session = useSession();
	const { profile } = useProfile({ callbacks: toastCallbacks });

	const firstName = profile?.first_name?.value ?? '';
	const lastName = profile?.last_name?.value ?? '';
	const userName =
		firstName || lastName
			? `${firstName} ${lastName}`.trim()
			: session.email || undefined;
	const userInitials =
		firstName && lastName
			? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
			: undefined;

	return (
		<div className="bg-background min-h-screen flex flex-col">
			<ProfileNavigation>
				{session.isAuthenticated ? (
					<Button
						theme="neutral"
						variant="solid"
						size="md"
						onClick={() => session.logout()}
					>
						Log out
					</Button>
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
						userName={userName}
						userInitials={userInitials}
					/>

					{children}
				</div>
			</div>
		</div>
	);
};
