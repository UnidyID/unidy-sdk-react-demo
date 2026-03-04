import { createMetadata } from '@/lib/metadata';
import { NewsletterPage } from '@/modules/newsletter/pages/newsletter-page';
import { Suspense } from 'react';

export default function Page() {
	return (
		<Suspense>
			<NewsletterPage />
		</Suspense>
	);
}
export const metadata = createMetadata('Newsletter Preferences');
