'use client';

import { useSession } from '@unidy.io/sdk-react';
import { KeyRound, Lock, Mail, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { LoggedInPlaceholder } from '../examples/logged-in-placeholder';
import { LoginKitchenSinkExample } from '../examples/login-kitchen-sink-example';
import { LoginSimpleExample } from '../examples/login-simple-example';
import { LoginSocialExample } from '../examples/login-social-example';

const integrationCode = `import { useLogin } from '@unidy.io/sdk-react';

function LoginForm() {
  const login = useLogin();

  // Multi-step state machine
  // login.step: "email" | "verification" | "password"
  //           | "magic-code" | "reset-password" | "authenticated"

  const handleSubmit = async () => {
    await login.submitEmail(email);
    // SDK returns loginOptions: { password, magic_link, social_logins }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} disabled={login.isLoading} />
      <button type="submit">Continue</button>
    </form>
  );
}`;

export const AuthenticationSection = () => {
	const [mounted, setMounted] = useState(false);
	const session = useSession();

	useEffect(() => {
		setMounted(true);
	}, []);

	const isLoggedIn = mounted && session.isAuthenticated;

	const features = [
		{
			icon: <Lock className="size-4 text-accent" />,
			title: 'Password',
			description:
				'Secure email and password sign-in for a familiar login experience'
		},
		{
			icon: <Users className="size-4 text-accent" />,
			title: 'Social Login',
			description:
				'Connect with Google, Facebook, Apple, or many other providers.'
		},
		{
			icon: <Mail className="size-4 text-accent" />,
			title: 'Magic Code',
			description: 'One-time code sent directly to email for quick access'
		},
		{
			icon: <KeyRound className="size-4 text-accent" />,
			title: (
				<span className="flex flex-wrap items-center gap-2">
					<span>Passkey &amp; Biometric</span>
					<span className="caption rounded-full border border-neutral-medium bg-neutral-weak px-2 py-0.5 text-neutral-strong">
						Coming soon
					</span>
				</span>
			),
			description:
				'Passwordless authentication with Face ID, Touch ID, or device security'
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
								Simple
							</TabsTrigger>
							<TabsTrigger value="social" className="flex-1">
								Social
							</TabsTrigger>
							<TabsTrigger value="kitchen-sink" className="flex-1">
								Full demo
							</TabsTrigger>
						</TabsList>

						{/* Card with Form */}
						<Card className="mt-6">
							<TabsContent value="simple">
								{isLoggedIn ? <LoggedInPlaceholder /> : <LoginSimpleExample />}
							</TabsContent>

							<TabsContent value="social">
								{isLoggedIn ? <LoggedInPlaceholder /> : <LoginSocialExample />}
							</TabsContent>

							<TabsContent value="kitchen-sink">
								{isLoggedIn ? (
									<LoggedInPlaceholder />
								) : (
									<LoginKitchenSinkExample />
								)}
							</TabsContent>
						</Card>
					</Tabs>
				</div>
			</div>
		</section>
	);
};
