import { Suspense } from 'react';
import { ProfileNewsletterPage } from '@/modules/profile/pages/profile-newsletter-page';

export default function Page() {
	return (
		<Suspense>
			<ProfileNewsletterPage />
		</Suspense>
	);
}
