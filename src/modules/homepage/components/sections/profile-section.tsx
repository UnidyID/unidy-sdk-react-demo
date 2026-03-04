import { Card } from '@/components/card';
import { FeatureItem } from '@/components/feature-item';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/shadcn/ui/button';
import { Check, Code } from 'lucide-react';
import { ProfileExample } from '../examples/profile-example';

export const ProfileSection = () => {
	const features = [
		{
			icon: <Check className="size-4 text-accent" />,
			title: 'Complete Profile',
			description:
				'Manage personal information, preferences, and account settings'
		},
		{
			icon: <Check className="size-4 text-accent" />,
			title: 'Custom Attributes',
			description:
				'Add custom fields like bio, location, or any other user data'
		},
		{
			icon: <Check className="size-4 text-accent" />,
			title: 'Real-time Updates',
			description: 'Profile changes sync instantly across all connected devices'
		}
	];

	return (
		<section
			className="bg-section flex flex-col items-center px-6 py-20 w-full"
			id="profile"
		>
			<div className="flex flex-col md:flex-row gap-12 items-start max-w-[1024px] w-full">
				{/* Left Column - Heading and Features */}
				<div className="flex flex-col gap-6 flex-1 min-w-0 w-full">
					<SectionHeading
						title="User Profile Management"
						description="Complete profile management with personal information, preferences, and connected accounts."
					>
						<Button theme="accent" variant="ghost" size="sm" className="w-fit">
							<Code className="size-4" />
							View Integration Code
						</Button>
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

				{/* Right Column - Card with Form */}
				<div className="flex-1 min-w-0 w-full">
					<Card className="relative">
						<ProfileExample />
					</Card>
				</div>
			</div>
		</section>
	);
};
