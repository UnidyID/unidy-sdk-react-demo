'use client';

import { Check } from 'lucide-react';
import { Card } from '@/components/card';
import { FeatureItem } from '@/components/feature-item';
import { IntegrationCode } from '@/components/integration-code';
import { SectionHeading } from '@/components/section-heading';
import { cn } from '@/components/shadcn/utils';
import { NewsletterExample } from '@/modules/homepage/components/examples/newsletter-example';
import {
	newsletterFeatureList,
	newsletterIntegrationCode,
	newsletterSectionCopy
} from '../constants/newsletter-data';

export interface NewsletterSubscriptionShowcaseProps {
	className?: string;
	showSidebarCopy?: boolean;
	showCardTitle?: boolean;
}

export const NewsletterSubscriptionShowcase = ({
	className,
	showSidebarCopy = true,
	showCardTitle = false
}: NewsletterSubscriptionShowcaseProps) => {
	const cardContent = (
		<div className="flex-1 min-w-0 w-full">
			{showCardTitle && (
				<div className="mb-6">
					<h2 className="title-2 text-neutral">
						{newsletterSectionCopy.title}
					</h2>
				</div>
			)}
			<Card className="relative">
				<NewsletterExample />
			</Card>
		</div>
	);

	if (!showSidebarCopy) {
		return <div className={cn('w-full', className)}>{cardContent}</div>;
	}

	return (
		<div
			className={cn(
				'flex flex-col-reverse md:flex-row gap-12 items-start w-full',
				className
			)}
		>
			{cardContent}

			<div className="flex flex-col gap-6 flex-1 min-w-0 w-full">
				<SectionHeading
					title={newsletterSectionCopy.title}
					description={newsletterSectionCopy.description}
				>
					<IntegrationCode
						code={newsletterIntegrationCode}
						language="typescript"
					/>
				</SectionHeading>

				<div className="flex flex-col gap-4 w-full">
					{newsletterFeatureList.map((feature) => (
						<FeatureItem
							key={feature.title}
							icon={<Check className="size-4 text-accent" />}
							title={feature.title}
							description={feature.description}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
