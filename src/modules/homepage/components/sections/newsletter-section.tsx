'use client';

import { Card } from '@/components/card';
import { FeatureItem } from '@/components/feature-item';
import { IntegrationCode } from '@/components/integration-code';
import { SectionHeading } from '@/components/section-heading';
import { Check } from 'lucide-react';
import { NewsletterExample } from '../examples/newsletter-example';

const integrationCode = `import { useNewsletterSubscribe } from '@unidy.io/sdk-react';

function SubscribeForm() {
  const { subscribe, isLoading, fieldErrors } = useNewsletterSubscribe({
    callbacks: {
      onSuccess: (msg) => toast.success(msg),
      onError: (err) => toast.error(err),
    },
  });

  const handleSubmit = async () => {
    const result = await subscribe({
      email: 'user@example.com',
      newsletters: [{ internalName: 'sports' }],
      additionalFields: { first_name: 'John' },
    });
  };
}`;

export const NewsletterSection = () => {
	const features = [
		{
			icon: <Check className="size-4 text-accent" />,
			title: 'Multiple Lists',
			description:
				'Organize subscribers into different lists for targeted campaigns'
		},
		{
			icon: <Check className="size-4 text-accent" />,
			title: 'Easy Management',
			description:
				'Simple API to add, remove, and update subscriber preferences'
		},
		{
			icon: <Check className="size-4 text-accent" />,
			title: 'Customizable',
			description:
				'Fully customizable subscription forms and preference management'
		}
	];

	return (
		<section
			className="bg-background flex flex-col items-center px-6 py-20 w-full"
			id="newsletter"
		>
			<div className="flex flex-col-reverse md:flex-row gap-12 items-start max-w-[1024px] w-full">
				{/* Left Column - Card with Form */}
				<div className="flex-1 min-w-0 w-full">
					<Card className="relative">
						<NewsletterExample />
					</Card>
				</div>

				{/* Right Column - Heading and Features */}
				<div className="flex flex-col gap-6 flex-1 min-w-0 w-full">
					<SectionHeading
						title="Newsletter Subscription"
						description="Flexible newsletter management with multiple list options. Keep your fans engaged with personalized content."
					>
						<IntegrationCode code={integrationCode} language="typescript" />
					</SectionHeading>

					{/* Feature Items */}
					<div className="flex flex-col gap-4 w-full">
						{features.map((feature, index) => (
							<FeatureItem
								key={index}
								icon={feature.icon}
								title={feature.title}
								description={feature.description}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
