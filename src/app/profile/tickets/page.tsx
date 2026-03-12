import { Suspense } from 'react';
import { ProfileTicketsPage } from '@/modules/profile/pages/profile-tickets-page';

export default function Page() {
	return (
		<Suspense>
			<ProfileTicketsPage />
		</Suspense>
	);
}
