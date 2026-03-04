'use client';

import { CardSelect } from '@/components/card-select';
import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import { cn } from '@/components/shadcn/utils';
import { toastCallbacks } from '@/deps/unidy/callbacks';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';
import { useNewsletterSubscribe } from '@unidy.io/sdk-react';
import {
	Bell,
	Check,
	CheckCircle2,
	Loader2,
	Mail,
	Phone,
	Trophy,
	User,
	Users
} from 'lucide-react';
import { useState } from 'react';

const newsletters = [
	{
		id: 'match-updates',
		icon: <Trophy className="size-5 text-neutral-strong" />,
		title: 'Match Updates & Results',
		description: 'Get live scores, match highlights, and post-game analysis'
	},
	{
		id: 'player-news',
		icon: <Users className="size-5 text-neutral-strong" />,
		title: 'Player News',
		description:
			'Transfer updates, injury reports, and exclusive player interviews'
	},
	{
		id: 'shop-offers',
		icon: <Trophy className="size-5 text-neutral-strong" />,
		title: 'Shop Offers & Merchandise',
		description: 'Exclusive discounts and early access to new merchandise'
	},
	{
		id: 'club-updates',
		icon: <Bell className="size-5 text-neutral-strong" />,
		title: 'General Club Updates',
		description: 'Club announcements, events, and community news'
	}
];

export const NewsletterExample = () => {
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [selectedNewsletters, setSelectedNewsletters] = useState<string[]>([]);
	const [consentChecked, setConsentChecked] = useState(false);
	const [subscribed, setSubscribed] = useState(false);

	const { isLoading, fieldErrors, subscribe, reset } =
		useNewsletterSubscribe({ callbacks: toastCallbacks });

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
			newsletters: selectedNewsletters.map((id) => ({ internalName: id })),
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
						<h3 className="title-2 text-neutral">
							Thank you for subscribing!
						</h3>
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

	return (
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
									'border rounded-[10px] h-[50px] flex gap-2 items-center px-4 bg-section',
									fieldErrors.email
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
									className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
								/>
							</div>
						</SDKWrapper>
						{fieldErrors.email && (
							<p className="body-3 text-red-500 mt-1">{fieldErrors.email}</p>
						)}
					</FormLabel>
				</div>

				{/* Additional Fields */}
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

				{/* Newsletter Selection */}
				<FormLabel title="Select Newsletters" required>
					<div className="flex flex-col gap-3 w-full">
						{newsletters.map((newsletter) => (
							<CardSelect
								key={newsletter.id}
								icon={newsletter.icon}
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
						I want to receive the newsletter of the brand with information
						about their entertainment offers and specials via email. My data
						will not be passed along to third-persons. My consent can at any
						time be revoked via Email to info@unidy.io. I accept the data
						protection terms and terms of use.
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
						{isLoading ? (
							<Loader2 className="size-4 animate-spin" />
						) : null}
						Subscribe to Selected Newsletters
					</Button>
				</SDKWrapper>
			</div>
		</SDKWrapper>
	);
};
