'use client';

import { CreditCard, Mail, Ticket, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import { Button } from '@/components/shadcn/ui/button';
import { cn } from '@/components/shadcn/utils';

export interface ProfileSidebarProps {
	userName?: string;
	userInitials?: string;
	memberSince?: string;
	statusText?: string;
	className?: string;
	children?: React.ReactNode;
	showNavigation?: boolean;
	isLoadingUser?: boolean;
}

export const ProfileSidebar: FC<ProfileSidebarProps> = ({
	userName,
	userInitials,
	memberSince,
	statusText,
	className,
	children,
	showNavigation = true,
	isLoadingUser = false
}) => {
	const pathname = usePathname();
	const displayName = isLoadingUser ? 'Loading' : userName || 'Signed out';
	const secondaryText = isLoadingUser
		? 'Loading your profile'
		: statusText || (memberSince ? `Member since ${memberSince}` : '');

	const navItems = [
		{
			id: 'details',
			label: 'Profile Info',
			icon: User,
			href: '/profile/details'
		},
		{
			id: 'newsletter',
			label: 'Newsletter',
			icon: Mail,
			href: '/profile/newsletter'
		},
		{
			id: 'tickets',
			label: 'Tickets',
			icon: Ticket,
			href: '/profile/tickets'
		},
		{
			id: 'subscriptions',
			label: 'Subscriptions',
			icon: CreditCard,
			href: '/profile/subscriptions'
		}
	];

	const isActive = (href: string) => {
		if (href === '/profile/details') {
			return pathname === '/profile' || pathname === '/profile/details';
		}
		return pathname === href;
	};

	return (
		<div className="flex flex-col">
			<div
				className={cn(
					'bg-section border border-neutral-weak rounded-[12px] p-6 flex flex-col gap-6 w-full md:w-[280px] shrink-0',
					className
				)}
			>
				{/* User Info */}
				<div className="flex flex-col gap-4 items-center px-4">
					<div className="relative size-24">
						{!isLoadingUser && userInitials ? (
							<>
								<div className="absolute bg-accent rounded-full size-24 flex items-center justify-center">
									<p className="text-[30px] leading-[36px] text-white font-normal tracking-[0.3955px]">
										{userInitials}
									</p>
								</div>
								<div className="absolute bg-white border-2 border-section rounded-full size-8 flex items-center justify-center bottom-0 right-0 p-0.5">
									<User className="size-4 text-neutral-strong" />
								</div>
							</>
						) : (
							<div className="absolute bg-neutral-weak rounded-full size-24 flex items-center justify-center">
								<User className="size-9 text-neutral-medium" />
							</div>
						)}
					</div>

					<div className="flex flex-col gap-1 items-center text-center">
						<p className="body-1 text-neutral">{displayName}</p>
						{secondaryText ? (
							<p className="body-2 text-neutral-strong">{secondaryText}</p>
						) : null}
					</div>
				</div>

				{/* Navigation */}
				{showNavigation && (
					<div className="flex flex-row md:flex-col">
						{navItems.map((item) => {
							const Icon = item.icon;
							const active = isActive(item.href);

							return (
								<Link
									key={item.id}
									href={item.href}
									className="w-full md:w-auto"
								>
									<Button
										theme={active ? 'accent' : 'neutral'}
										variant={active ? 'outline-weak' : 'ghost'}
										className={cn(
											'w-full lg:justify-start',
											active ? 'bg-accent-weak' : ''
										)}
										size="md"
									>
										<Icon />

										{item.label}
									</Button>
								</Link>
							);
						})}
					</div>
				)}

				{/* Additional Content */}
				{children}
			</div>
		</div>
	);
};
