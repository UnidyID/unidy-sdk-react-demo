'use client';

import { Card } from '@/components/card';
import { FeatureItem } from '@/components/feature-item';
import { IntegrationCode } from '@/components/integration-code';
import { SectionHeading } from '@/components/section-heading';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from '@/components/shadcn/ui/tabs';
import { Mail, Shield, Users } from 'lucide-react';
import { LoginExtrasExample } from '../examples/login-extras-example';
import { LoginSimpleExample } from '../examples/login-simple-example';
import { LoginSocialExample } from '../examples/login-social-example';

const integrationCode = `import { UnidyAuth, UnidyNewsletter } from '@unidy/sdk';

// Initialize authentication
const auth = new UnidyAuth({
  apiKey: 'your-api-key',
  theme: {
    primaryColor: '#DC2626',
    brandName: 'FC United'
  }
});

// Add newsletter signup
const newsletter = new UnidyNewsletter({
  apiKey: 'your-api-key',
  lists: ['match-updates', 'player-news', 'shop-offers']
});`;

export const AuthenticationSection = () => {
	const features = [
		{
			icon: <Shield className="size-4 text-accent" />,
			title: 'Passkey & Biometric',
			description:
				'Passwordless authentication with Face ID, Touch ID, or device security'
		},
		{
			icon: <Mail className="size-4 text-accent" />,
			title: 'Magic Code',
			description: 'One-time code sent directly to email for quick access'
		},
		{
			icon: <Users className="size-4 text-accent" />,
			title: 'Social Login',
			description:
				'Connect with Google, Facebook, Apple, or many other providers.'
		}
	];

	return (
		<section
			className="bg-section flex flex-col items-center px-6 py-20 w-full"
			id="authentication"
		>
			<div className="flex flex-col md:flex-row gap-12 items-start max-w-[1024px] w-full">
				{/* Left Column - Heading and Features */}
				<div className="flex flex-col gap-6 flex-1 min-w-0">
					<SectionHeading
						title="Authentication SDK"
						description="Multiple authentication methods in one unified SDK. Give your users the flexibility to login their way."
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

				{/* Right Column - Tabs and Card */}
				<div className="flex flex-col gap-6 flex-1 min-w-0 w-full">
					{/* Tabs */}
					<Tabs defaultValue="simple" className="w-full">
						<TabsList className="w-full">
							<TabsTrigger value="simple" className="flex-1">
								Simple Login
							</TabsTrigger>
							<TabsTrigger value="social" className="flex-1">
								Social Integrations
							</TabsTrigger>
							<TabsTrigger value="extras" className="flex-1">
								Extras
							</TabsTrigger>
						</TabsList>

						{/* Card with Form */}
						<Card className="mt-6">
							<TabsContent value="simple">
								<LoginSimpleExample />
							</TabsContent>

							<TabsContent value="social">
								<LoginSocialExample />
							</TabsContent>

							<TabsContent value="extras">
								<LoginExtrasExample />
							</TabsContent>
						</Card>
					</Tabs>
				</div>
			</div>
		</section>
	);
};
