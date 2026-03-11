'use client';

import { NewsletterSubscriptionShowcase } from '@/modules/newsletter/components/newsletter-subscription-showcase';

export const NewsletterSection = () => {
	return (
		<section
			className="bg-background flex flex-col items-center px-6 py-20 w-full"
			id="newsletter"
		>
			<div className="max-w-[1024px] w-full">
				<NewsletterSubscriptionShowcase />
			</div>
		</section>
	);
};
