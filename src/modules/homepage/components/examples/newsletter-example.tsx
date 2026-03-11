'use client';

import {
	useNewsletterPreferenceCenter,
	useNewsletterSubscribe,
	useSession
} from '@unidy.io/sdk-react';
import {
	Bell,
	Check,
	CheckCircle2,
	ExternalLink,
	Loader2,
	Mail,
	Phone,
	Trophy,
	User,
	Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CardSelect } from '@/components/card-select';
import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import { cn } from '@/components/shadcn/utils';
import {
	fetchCallbackOptions,
	mutationCallbackOptions
} from '@/deps/unidy/callbacks';
import {
	buildNewslettersPayload,
	subscribableOptions
} from '@/modules/newsletter/constants/newsletter-data';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';

/** Only rendered when logged in — keeps the useNewsletterPreferenceCenter hook from firing for anonymous users. */
const ExistingSubscriptionsGate = ({
	children
}: {
	children: React.ReactNode;
}) => {
	const { subscriptions, isLoading } = useNewsletterPreferenceCenter({
		callbacks: fetchCallbackOptions
	});

	if (isLoading) return null;

	if (subscriptions.length > 0) {
		return (
			<SDKWrapper
				title="Newsletter SDK / Subscription Form"
				codeSnippet={`const { subscriptions } = useNewsletterPreferenceCenter();
// User already has ${subscriptions.length} subscription(s)`}
				size="lg"
				labelPosition="top-left"
				detatched
				popoverPosition="right"
			>
				<div className="flex flex-col gap-6 w-full items-center py-12">
					<CheckCircle2 className="size-12 text-accent" />
					<div className="flex flex-col gap-2 items-center text-center">
						<h3 className="title-2 text-neutral">
							You&apos;re already subscribed!
						</h3>
						<p className="body-2 text-neutral-strong">
							You have {subscriptions.length} active newsletter
							{subscriptions.length !== 1 ? 's' : ''}. Manage your preferences
							from the preference center.
						</p>
					</div>
					<Link href="/newsletter/manage">
						<Button theme="accent" variant="solid" size="md">
							<ExternalLink className="size-4" />
							Edit Newsletter Preferences
						</Button>
					</Link>
				</div>
			</SDKWrapper>
		);
	}

	return <>{children}</>;
};

export const NewsletterExample = () => {
	const iconMap = {
		trophy: <Trophy className="size-5 text-neutral-strong" />,
		users: <Users className="size-5 text-neutral-strong" />,
		bell: <Bell className="size-5 text-neutral-strong" />
	};

	const session = useSession();
	const [mounted, setMounted] = useState(false);
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [selectedNewsletters, setSelectedNewsletters] = useState<string[]>([]);
	const [consentChecked, setConsentChecked] = useState(false);
	const [subscribed, setSubscribed] = useState(false);

	const isLoggedIn = mounted && session.isAuthenticated;

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (isLoggedIn && session.email) {
			setEmail(session.email);
		}
	}, [isLoggedIn, session.email]);

	const { isLoading, fieldErrors, subscribe, reset } = useNewsletterSubscribe({
		callbacks: mutationCallbackOptions
	});

	const toggleNewsletter = (id: string) => {
		setSelectedNewsletters((prev) =>
			prev.includes(id)
				? prev.filter((newsletterId) => newsletterId !== id)
				: [...prev, id]
		);
	};

	const handleSubmit = async () => {
		const result = await subscribe({
			email,
			newsletters: buildNewslettersPayload(selectedNewsletters),
			additionalFields: {
				first_name: firstName || null,
				last_name: lastName || null,
				phone_number: phoneNumber || null
			}
		});

		if (result.success) {
			setSubscribed(true);
		}
	};

	const handleReset = () => {
		reset();
		setSubscribed(false);
		setEmail('');
		setFirstName('');
		setLastName('');
		setPhoneNumber('');
		setSelectedNewsletters([]);
		setConsentChecked(false);
	};

	if (subscribed) {
		return (
			<SDKWrapper
				title="Newsletter SDK / Subscription Form"
				codeSnippet={`const { subscribe } = useNewsletterSubscribe();
await subscribe({ email, newsletters });`}
				size="lg"
				labelPosition="top-left"
				detatched
				popoverPosition="right"
			>
				<div className="flex flex-col gap-6 w-full items-center py-12">
					<CheckCircle2 className="size-12 text-accent" />
					<div className="flex flex-col gap-2 items-center text-center">
						<h3 className="title-2 text-neutral">Thank you for subscribing!</h3>
						<p className="body-2 text-neutral-strong">
							Please check your email to confirm your subscription.
						</p>
					</div>
					<Button
						theme="neutral"
						variant="outline"
						size="md"
						onClick={handleReset}
					>
						Subscribe with another email
					</Button>
				</div>
			</SDKWrapper>
		);
	}

	const form = (
		<SDKWrapper
			title="Newsletter SDK / Subscription Form"
			codeSnippet={`const { subscribe, isLoading, fieldErrors } = useNewsletterSubscribe();
await subscribe({ email, newsletters, additionalFields });`}
			size="lg"
			labelPosition="top-left"
			detatched
			popoverPosition="right"
		>
			<div className="flex flex-col gap-6 w-full">
				{/* Email Input */}
				<div className="flex flex-col gap-2 relative">
					<FormLabel title="Email Address" required>
						<SDKWrapper
							title="Newsletter SDK / Email Input"
							codeSnippet="subscribe({ email, newsletters })"
							size="sm"
							labelPosition="bottom-right"
							popoverPosition="right"
							className="relative"
						>
							<div
								className={cn(
									'border rounded-[10px] h-[50px] flex gap-2 items-center px-4',
									isLoggedIn
										? 'border-neutral-medium bg-neutral-weak'
										: 'bg-section',
									!isLoggedIn && fieldErrors.email
										? 'border-red-500'
										: 'border-neutral-medium'
								)}
							>
								<Mail className="size-5 text-neutral-medium shrink-0" />
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="john.doe@example.com"
									disabled={isLoggedIn}
									className={cn(
										'flex-1 min-w-0 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium',
										isLoggedIn && 'cursor-not-allowed'
									)}
								/>
							</div>
						</SDKWrapper>
						{isLoggedIn && (
							<p className="body-3 text-neutral-strong mt-1">
								<button
									type="button"
									onClick={() => session.logout()}
									className="text-accent underline hover:text-accent-strong cursor-pointer"
								>
									Logout
								</button>{' '}
								to use a different email
							</p>
						)}
						{fieldErrors.email && (
							<p className="body-3 text-red-500 mt-1">{fieldErrors.email}</p>
						)}
					</FormLabel>
				</div>

				{/* Additional Fields */}
				{!isLoggedIn && (
					<FormLabel title="Additional Fields">
						<div className="flex flex-col gap-3 w-full">
							<div>
								<div
									className={cn(
										'relative border rounded-[10px] h-[50px] flex gap-2 items-center px-4 bg-section',
										fieldErrors.first_name
											? 'border-red-500'
											: 'border-neutral-medium'
									)}
								>
									<User className="size-5 text-neutral-medium shrink-0" />
									<input
										type="text"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										placeholder="First Name"
										className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
									/>
								</div>
								{fieldErrors.first_name && (
									<p className="body-3 text-red-500 mt-1">
										{fieldErrors.first_name}
									</p>
								)}
							</div>
							<div>
								<div
									className={cn(
										'relative border rounded-[10px] h-[50px] flex gap-2 items-center px-4 bg-section',
										fieldErrors.last_name
											? 'border-red-500'
											: 'border-neutral-medium'
									)}
								>
									<User className="size-5 text-neutral-medium shrink-0" />
									<input
										type="text"
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
										placeholder="Last Name"
										className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
									/>
								</div>
								{fieldErrors.last_name && (
									<p className="body-3 text-red-500 mt-1">
										{fieldErrors.last_name}
									</p>
								)}
							</div>
							<div>
								<div
									className={cn(
										'relative border rounded-[10px] h-[50px] flex gap-2 items-center px-4 bg-section',
										fieldErrors.phone_number
											? 'border-red-500'
											: 'border-neutral-medium'
									)}
								>
									<Phone className="size-5 text-neutral-medium shrink-0" />
									<input
										type="tel"
										value={phoneNumber}
										onChange={(e) => setPhoneNumber(e.target.value)}
										placeholder="Phone Number"
										className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
									/>
								</div>
								{fieldErrors.phone_number && (
									<p className="body-3 text-red-500 mt-1">
										{fieldErrors.phone_number}
									</p>
								)}
							</div>
						</div>
					</FormLabel>
				)}

				{/* Newsletter Selection */}
				<FormLabel title="Select Newsletters" required>
					<div className="flex flex-col gap-3 w-full">
						{subscribableOptions.map((newsletter) => (
							<CardSelect
								key={newsletter.id}
								icon={iconMap[newsletter.icon]}
								title={newsletter.title}
								description={newsletter.description}
								selected={selectedNewsletters.includes(newsletter.id)}
								onClick={() => toggleNewsletter(newsletter.id)}
							/>
						))}
					</div>
				</FormLabel>

				{/* Consent */}
				<button
					type="button"
					onClick={() => setConsentChecked((prev) => !prev)}
					className="flex gap-3 items-start text-left"
				>
					<div
						className={cn(
							'border-2 rounded-md size-5 shrink-0 flex items-center justify-center mt-0.5 transition-all',
							consentChecked
								? 'border-neutral-strong bg-neutral-strong'
								: 'border-neutral-strong'
						)}
					>
						{consentChecked && <Check className="size-3 text-section" />}
					</div>
					<p className="body-3 text-neutral-strong">
						I want to receive the newsletter of the brand with information about
						their entertainment offers and specials via email. My data will not
						be passed along to third-persons. My consent can at any time be
						revoked via Email to info@unidy.io. I accept the data protection
						terms and terms of use.
					</p>
				</button>

				{/* Submit Button */}
				<SDKWrapper
					title="Newsletter SDK / Submit"
					codeSnippet="subscribe({ email, newsletters, additionalFields })"
					size="sm"
					popoverPosition="right"
				>
					<Button
						theme="accent"
						variant="solid"
						size="lg"
						className="w-full"
						onClick={handleSubmit}
						disabled={
							isLoading ||
							!email ||
							selectedNewsletters.length === 0 ||
							!consentChecked
						}
					>
						{isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
						Subscribe to Selected Newsletters
					</Button>
				</SDKWrapper>
			</div>
		</SDKWrapper>
	);

	if (isLoggedIn) {
		return (
			<ExistingSubscriptionsGate>{form}</ExistingSubscriptionsGate>
		);
	}

	return form;
};
