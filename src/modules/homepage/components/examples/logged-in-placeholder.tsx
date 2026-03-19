'use client';

import { Button } from '@/components/shadcn/ui/button';
import { useSession } from '@unidy.io/sdk-react';
import { LogOut, Ticket, CreditCard, Mail, User } from 'lucide-react';
import Link from 'next/link';

export const LoggedInPlaceholder = () => {
	const session = useSession();

	const handleLogout = async () => {
		await session.logout();
	};

	return (
		<div className="flex flex-col items-center justify-center gap-4 py-8">
			<p className="body-1 text-neutral-strong">
				You&apos;re already logged in.
			</p>
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Link href="/profile/tickets">
					<Button theme="neutral" variant="outline" size="md">
						<Ticket className="size-4" />
						My Tickets
					</Button>
				</Link>
				<Link href="/profile/subscriptions">
					<Button theme="neutral" variant="outline" size="md">
						<CreditCard className="size-4" />
						My Subscriptions
					</Button>
				</Link>
				<Link href="/profile/newsletter">
					<Button theme="neutral" variant="outline" size="md">
						<Mail className="size-4" />
						My Newsletter
					</Button>
				</Link>
				<Link href="/profile">
					<Button theme="neutral" variant="outline" size="md">
						<User className="size-4" />
						My Profile
					</Button>
				</Link>
				<Button
					theme="neutral"
					variant="solid"
					size="md"
					onClick={handleLogout}
					disabled={session.isLoading}
				>
					<LogOut className="size-4" />
					Log out
				</Button>
			</div>
		</div>
	);
};
