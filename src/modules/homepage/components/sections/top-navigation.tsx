'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/shadcn/ui/button';
import { ThemeToggler } from '@/lib/theme/components/theme-toggler';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';
import { LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useSession } from '@unidy.io/sdk-react';
import { toastCallbacks } from '@/deps/unidy/callbacks';

export const TopNavigation = () => {
	const [mounted, setMounted] = useState(false);
	const session = useSession({ callbacks: toastCallbacks });

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleLogout = async () => {
		await session.logout();
	};

	return (
		<header className="bg-foreground backdrop-blur-2xl sticky top-0 z-50 border-b border-neutral-weak flex flex-col items-center justify-center w-full">
			<div className="flex h-16 items-center justify-between max-w-[1024px] w-full px-4">
				{/* Logo */}
				<Logo />

				{/* Right Side - Auth Buttons */}
				<div className="flex gap-3 items-center relative">
					<ThemeToggler />

					{mounted && session.isAuthenticated ? (
						<>
							{/* Profile Button with SDKElement */}
							<SDKWrapper
								title="Auth SDK"
								codeSnippet="<ProfileButton />"
								size="sm"
								labelPosition="bottom-right"
								detatched
							>
								<Link href="/profile">
									<Button
										theme="neutral"
										variant="ghost"
										size="md"
										className="w-[71px]"
									>
										<User />
										Profile
									</Button>
								</Link>
							</SDKWrapper>

							{/* Log Out Button */}
							<Button
								theme="accent"
								variant="solid"
								size="md"
								onClick={handleLogout}
								disabled={session.isLoading}
							>
								<LogOut />
								Log out
							</Button>
						</>
					) : (
						<>
							{/* Log In Button with SDKElement */}
							<SDKWrapper
								title="Auth SDK"
								codeSnippet="<LoginButton />"
								size="sm"
								labelPosition="bottom-right"
								popoverPosition="left"
								detatched
							>
								<Link href="/login">
									<Button
										theme="accent"
										variant="solid"
										size="md"
									>
										<LogIn />
										Log in
									</Button>
								</Link>
							</SDKWrapper>
						</>
					)}
				</div>
			</div>
		</header>
	);
};
