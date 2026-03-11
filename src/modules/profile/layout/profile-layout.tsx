'use client';

import { useProfile, useSession } from '@unidy.io/sdk-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FC, type PropsWithChildren, useEffect, useState } from 'react';
import { Button } from '@/components/shadcn/ui/button';
import { fetchCallbackOptions } from '@/deps/unidy/callbacks';
import { ProfileNavigation } from '../components/profile-navigation';
import { ProfileSidebar } from '../components/profile-sidebar';

export const ProfileLayout: FC<PropsWithChildren> = ({ children }) => {
	const [mounted, setMounted] = useState(false);
	const session = useSession();
	const { profile, isLoading: isProfileLoading } = useProfile({
		callbacks: fetchCallbackOptions
	});
	const router = useRouter();

	useEffect(() => {
		setMounted(true);
	}, []);

	const firstName = profile?.first_name?.value ?? '';
	const lastName = profile?.last_name?.value ?? '';
	const userName =
		firstName || lastName
			? `${firstName} ${lastName}`.trim()
			: session.email || 'Signed out';
	const userInitials =
		firstName && lastName
			? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
			: undefined;
	const isUserLoading =
		!mounted ||
		session.isLoading ||
		(session.isAuthenticated && isProfileLoading);
	const statusText = session.isAuthenticated
		? 'Manage your account details'
		: 'Sign in to change preferences';

	const handleLogout = async () => {
		await session.logout();
		router.push('/login');
	};

	return (
		<div className="bg-background min-h-screen flex flex-col">
			<ProfileNavigation>
				{mounted && session.isAuthenticated ? (
					<Button
						theme="neutral"
						variant="solid"
						size="md"
						onClick={handleLogout}
						disabled={session.isLoading}
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
						statusText={statusText}
						isLoadingUser={isUserLoading}
					/>

					{children}
				</div>
			</div>
		</div>
	);
};
