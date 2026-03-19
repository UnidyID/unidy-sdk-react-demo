import { Suspense } from 'react';
import { ProfileDetailsPage } from '@/modules/profile/pages/profile-details-page';

export default function Page() {
	return (
		<Suspense>
			<ProfileDetailsPage />
		</Suspense>
	);
}
