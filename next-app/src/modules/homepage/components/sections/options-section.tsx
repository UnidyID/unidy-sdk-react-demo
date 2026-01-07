'use client';

import { LinkSmooth } from '@/components/link-smooth';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/shadcn/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/shadcn/ui/dialog';
import { OptionItem } from '@/modules/homepage/components/option-item';
import {
	ArrowDown,
	Expand,
	ExternalLink,
	Lock,
	Mail,
	Ticket,
	User
} from 'lucide-react';
import Link from 'next/link';
import { LoginModalExample } from '../examples/login-modal-example';

export const OptionsSection = () => {
	return (
		<section
			className="bg-background flex flex-col items-center py-20 w-full px-6"
			id="options"
		>
			<div className="flex flex-col gap-16 items-center max-w-[1200px] w-full">
				{/* Heading */}
				<SectionHeading
					title="Unidy SDK Implementation Options"
					description="Each feature can be integrated in multiple ways. Scroll down to see inline implementations, or click the buttons to try Dialog versions."
					className="text-center! items-center!"
				/>

				{/* Options Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
					{/* Authentication */}
					<OptionItem
						icon={<Lock className="size-6 text-accent-contrast" />}
						title="Authentication"
						description="Multiple auth methods"
					>
						<LinkSmooth href="#authentication">
							<Button
								theme="neutral"
								variant="ghost"
								size="md"
								className="w-full justify-start"
							>
								<ArrowDown className="size-4" />
								Inline Demo
							</Button>
						</LinkSmooth>

						<Dialog>
							<DialogTrigger asChild>
								<Button
									theme="neutral"
									variant="ghost"
									size="md"
									className="w-full justify-start"
								>
									<Expand className="size-4" />
									Modal Demo
								</Button>
							</DialogTrigger>
							<DialogContent className="p-0">
								<DialogHeader className="hidden">
									<DialogTitle> Log in to FC Unidy</DialogTitle>
									<DialogDescription>
										Welcome back! Please enter your details.
									</DialogDescription>
								</DialogHeader>
								<LoginModalExample />
							</DialogContent>
						</Dialog>

						<Link href="/login">
							<Button
								theme="neutral"
								variant="ghost"
								size="md"
								className="w-full justify-start"
							>
								<ExternalLink className="size-4" />
								Dedicated Page Demo
							</Button>
						</Link>
					</OptionItem>

					{/* Newsletter */}
					<OptionItem
						icon={<Mail className="size-6 text-accent-contrast" />}
						title="Newsletter"
						description="Subscription management"
					>
						<LinkSmooth href="#newsletter">
							<Button
								theme="neutral"
								variant="ghost"
								size="md"
								className="w-full justify-start"
							>
								<ArrowDown className="size-4" />
								Inline Demo
							</Button>
						</LinkSmooth>

						<Link href="/newsletter">
							<Button
								theme="neutral"
								variant="ghost"
								size="md"
								className="w-full justify-start"
							>
								<ExternalLink className="size-4" />
								Dedicated Page Demo
							</Button>
						</Link>
					</OptionItem>

					{/* Profile */}
					<OptionItem
						icon={<User className="size-6 text-accent-contrast" />}
						title="Profile"
						description="User profile editor"
					>
						<LinkSmooth href="#profile">
							<Button
								theme="neutral"
								variant="ghost"
								size="md"
								className="w-full justify-start"
							>
								<ArrowDown className="size-4" />
								Inline Demo
							</Button>
						</LinkSmooth>

						<Link href="/profile">
							<Button
								theme="neutral"
								variant="ghost"
								size="md"
								className="w-full justify-start"
							>
								<ExternalLink className="size-4" />
								Dedicated Page Demo
							</Button>
						</Link>
					</OptionItem>

					{/* Tickets */}
					<OptionItem
						icon={<Ticket className="size-6 text-accent-contrast" />}
						title="Tickets"
						description="Manage tickets & subs"
					>
						<LinkSmooth href="#tickets">
							<Button
								theme="neutral"
								variant="ghost"
								size="md"
								className="w-full justify-start"
							>
								<ArrowDown className="size-4" />
								Inline Demo
							</Button>
						</LinkSmooth>
					</OptionItem>
				</div>
			</div>
		</section>
	);
};
