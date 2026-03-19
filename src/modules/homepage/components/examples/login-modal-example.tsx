'use client';

import { DialogClose, useDialog } from '@/components/shadcn/ui/dialog';
import { LoginForm } from '@/modules/authentication/components/login-form';
import { RegistrationForm } from '@/modules/authentication/components/registration-form';
import { useCurrentReturnTo } from '@/modules/authentication/utils/return-to';
import { CheckCircle2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useUnidyClient } from '@unidy.io/sdk-react';

export const LoginModalExample = () => {
	const { closeDialog } = useDialog();
	const router = useRouter();
	const client = useUnidyClient();
	const returnTo = useCurrentReturnTo('/');
	const [activeView, setActiveView] = useState<'login' | 'register'>('login');
	const [registerEmail, setRegisterEmail] = useState('');
	const [pendingRegistrationNotice, setPendingRegistrationNotice] =
		useState(false);

	const handleAuthenticated = useCallback(() => {
		closeDialog();
		router.refresh();
	}, [closeDialog, router]);

	const handleAccountNotFound = useCallback(
		async (email: string) => {
			setPendingRegistrationNotice(false);
			const [errorCode] = await client.auth.sendResumeLink({ email });
			if (errorCode === null) {
				setPendingRegistrationNotice(true);
				return 'resume-link-sent' as const;
			}

			const normalizedErrorCode = errorCode as string;
			if (
				normalizedErrorCode !== 'connection_failed' &&
				normalizedErrorCode !== 'schema_validation_error' &&
				normalizedErrorCode !== 'internal_error'
			) {
				return 'registration-flow-not-found' as const;
			}

			return 'error' as const;
		},
		[client]
	);

	const handleRegisterInstead = useCallback((email: string) => {
		setPendingRegistrationNotice(false);
		setRegisterEmail(email);
		setActiveView('register');
	}, []);

	const handleSwitchToLogin = useCallback(() => {
		setPendingRegistrationNotice(false);
		setActiveView('login');
	}, []);

	return (
		<div className="flex flex-col md:flex-row md:h-[784px] overflow-hidden relative w-full">
			{/* Gradient Background Side */}
			<div className="min-h-[120px] md:h-full md:flex-1 md:shrink-0 relative flex flex-col items-center justify-center gap-6 px-10 py-12 bg-linear-[135deg,var(--color-accent-strong),var(--color-accent)_50%,var(--color-accent-strong)]">
				<p className="display-3 text-white text-center">
					{activeView === 'register' ? 'Create Your Account' : 'Welcome Back'}
				</p>
				<div className="flex flex-col gap-3 items-center max-w-[280px]">
					<p className="body-1 text-white/80 text-center">
						{activeView === 'register'
							? 'Register, verify your email, and get into your account without leaving this modal.'
							: 'Sign in to access your tickets, manage subscriptions, and update your profile.'}
					</p>
					<p className="body-3 text-white/50 text-center">
						Powered by the Unidy SDK — drop-in auth for any app.
					</p>
				</div>
			</div>

			{/* Content Side */}
			<div className="md:h-full flex-1 shrink-0 bg-section flex flex-col items-center justify-center p-10 relative">
				{/* Close Button */}
				<DialogClose
					className="absolute right-5 top-5 rounded-[12px] size-[52px] flex items-center justify-center hover:bg-neutral-weak transition-colors bg-transparent not-md:hidden"
					aria-label="Close"
				>
					<X className="size-6 text-neutral" />
				</DialogClose>

				{/* Form Content */}
				<div className="flex flex-col gap-6 w-full">
					{activeView === 'login' ? (
						<>
							<LoginForm
								returnTo={returnTo}
								onAuthenticated={handleAuthenticated}
								onAccountNotFound={handleAccountNotFound}
								onRegisterInstead={handleRegisterInstead}
							/>
							{pendingRegistrationNotice && (
								<div className="border border-neutral-medium rounded-[10px] p-4 flex gap-4 items-start bg-neutral-weak">
									<CheckCircle2 className="size-10 text-theme shrink-0" />
									<div className="flex flex-col gap-1">
										<p className="body-1 text-neutral-strong font-semibold">
											Pending registration found
										</p>
										<p className="body-2 text-neutral-strong">
											It looks like you started registering but haven&apos;t
											finished. Check your inbox for a link to continue.
										</p>
									</div>
								</div>
							)}
						</>
					) : (
						<RegistrationForm
							returnTo={returnTo}
							initialEmail={registerEmail}
							onAuthenticated={handleAuthenticated}
							onSwitchToLogin={handleSwitchToLogin}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
