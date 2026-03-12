import { Suspense } from 'react';
import { ProfileSubscriptionsPage } from '@/modules/profile/pages/profile-subscriptions-page';

export default function Page() {
	return (
		<Suspense>
			<ProfileSubscriptionsPage />
		</Suspense>
	);
}
