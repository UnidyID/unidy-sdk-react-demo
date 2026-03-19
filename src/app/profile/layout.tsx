import { Suspense } from 'react';
import { createMetadata } from '@/lib/metadata';
import { ProfileLayout } from '@/modules/profile/layout/profile-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense>
			<ProfileLayout>{children}</ProfileLayout>
		</Suspense>
	);
}
export const metadata = createMetadata('Profile');
