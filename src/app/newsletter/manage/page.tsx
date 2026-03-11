import { Suspense } from 'react';
import { createMetadata } from '@/lib/metadata';
import { NewsletterManagePage } from '@/modules/newsletter/pages/newsletter-manage-page';

export default function Page() {
	return (
		<Suspense>
			<NewsletterManagePage />
		</Suspense>
	);
}

export const metadata = createMetadata('Manage Newsletter');
