'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FC, type PropsWithChildren } from 'react';

import { useSession } from '@unidy.io/sdk-react';
import { toastCallbacks } from '@/lib/unidy/callbacks';

import { Button } from '@/components/shadcn/ui/button';
import { ProfileNavigation } from '../components/profile-navigation';
import { ProfileSidebar } from '../components/profile-sidebar';

export const ProfileLayout: FC<PropsWithChildren> = ({ children }) => {
	const session = useSession({ callbacks: toastCallbacks });
	const router = useRouter();

	const handleLogout = async () => {
		await session.logout();
		router.push('/login');
	};

	return (
		<div className="bg-background min-h-screen flex flex-col">
			<ProfileNavigation>
				{session.isAuthenticated ? (
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
					<ProfileSidebar />

					{children}
				</div>
			</div>
		</div>
	);
};
