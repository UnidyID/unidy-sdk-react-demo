'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/shadcn/ui/button';
import { ThemeToggler } from '@/lib/theme/components/theme-toggler';
import { SDKElement } from '@/modules/sdk-element/components/sdk-element';
import { LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const TopNavigation = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const toggleAuthState = () => {
		setIsLoggedIn((prev) => !prev);
	};

	return (
		<header className="bg-foreground backdrop-blur-2xl sticky top-0 z-50 border-b border-neutral-weak flex flex-col items-center justify-center w-full">
			<div className="flex h-16 items-center justify-between max-w-[1024px] w-full px-4">
				{/* Logo */}
				<Logo />

				{/* Right Side - Auth Buttons */}
				<div className="flex gap-3 items-center relative">
					<ThemeToggler />

					{isLoggedIn ? (
						<>
							{/* Profile Button with SDKElement */}
							<div className="relative">
								<SDKElement
									title="Auth SDK"
									codeSnippet="<ProfileButton />"
									size="sm"
									labelPosition="bottom-right"
									detatched
								/>
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
							</div>

							{/* Log Out Button */}
							<Button
								theme="accent"
								variant="solid"
								size="md"
								onClick={toggleAuthState}
							>
								<LogOut />
								Log out
							</Button>
						</>
					) : (
						<>
							{/* Log In Button with SDKElement */}
							<div className="relative">
								<SDKElement
									title="Auth SDK"
									codeSnippet="<LoginButton />"
									size="sm"
									labelPosition="bottom-right"
									popoverPosition="left"
									detatched
								/>
								<Button
									theme="accent"
									variant="solid"
									size="md"
									onClick={toggleAuthState}
								>
									<LogIn />
									Log in
								</Button>
							</div>
						</>
					)}
				</div>
			</div>
		</header>
	);
};
