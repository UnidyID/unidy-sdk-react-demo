import { createMetadata } from '@/lib/metadata';
import { NewsletterPage } from '@/modules/newsletter/pages/newsletter-page';

export default function Page() {
	return <NewsletterPage />;
}

export const metadata = createMetadata('Newsletter Subscription');
