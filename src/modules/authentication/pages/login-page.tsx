'use client';

import {
	useRegistration,
	useSession,
	useUnidyClient
} from '@unidy.io/sdk-react';
import { formatDuration, intervalToDuration } from 'date-fns';
import {
	ArrowLeft,
	CheckCircle2,
	Lock,
	Mail,
	ShieldCheck,
	User,
	X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/card';
import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import {
	ButtonTabs,
	ButtonTabsContent,
	ButtonTabsGroup,
	ButtonTabsList,
	ButtonTabsTrigger
} from '@/components/shadcn/ui/button-tabs';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from '@/components/shadcn/ui/input-group';
import { mutationCallbackOptions } from '@/deps/unidy/callbacks';
import { unidyClient } from '@/deps/unidy/client';
import { translateAuthError } from '@/locales/translate-auth-error';
import { LoginForm } from '../components/login-form';
import { SocialAuthButtons } from '../components/social-auth-buttons';
import { hydrateAuthFromPayload } from '../utils/hydrate-auth';
import {
	buildAbsoluteLoginHref,
	getReturnToFromSearchParams
} from '../utils/return-to';

const REGISTRATION_STORAGE_KEY = 'unidy_pending_registration';

export const LoginPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const client = useUnidyClient();
	const session = useSession();
	const redirectTo = useMemo(
		() => getReturnToFromSearchParams(searchParams),
		[searchParams]
	);
	const registration = useRegistration({ callbacks: mutationCallbackOptions });

	const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
	// Key to force LoginForm remount when switching tabs (resets its internal state)
	const [loginFormKey, setLoginFormKey] = useState(0);
	const [loginStep, setLoginStep] = useState('idle');

	// Register form state
	const [registerFirstName, setRegisterFirstName] = useState('');
	const [registerLastName, setRegisterLastName] = useState('');
	const [registerEmail, setRegisterEmail] = useState('');
	const [registerPassword, setRegisterPassword] = useState('');
	const [registerStep, setRegisterStep] = useState<'form' | 'verify-email'>(
		'form'
	);
	const [verificationCode, setVerificationCode] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [resendCountdown, setResendCountdown] = useState(0);
	const [resumeLinkSent, setResumeLinkSent] = useState(false);
	const [pendingRegistrationNotice, setPendingRegistrationNotice] =
		useState(false);
	const didAutoFetchRef = useRef(false);

	// Finalization can return tokens directly when registration already verified the
	// email, so hydrate the shared auth storage before redirecting.
	useEffect(() => {
		const auth = registration.registration?.auth;
		if (!auth) return;

		hydrateAuthFromPayload({
			auth,
			email: registration.registration?.email ?? registerEmail
		});

		localStorage.removeItem(REGISTRATION_STORAGE_KEY);
		router.replace(redirectTo);
	}, [
		registration.registration?.auth,
		registration.registration?.email,
		registerEmail,
		router,
		redirectTo
	]);

	useEffect(() => {
		if (session.isAuthenticated) {
			router.replace(redirectTo);
		}
	}, [session.isAuthenticated, router, redirectTo]);

	// Clear pending registration from localStorage when user logs in
	const handleLoginAuthenticated = useCallback(() => {
		localStorage.removeItem(REGISTRATION_STORAGE_KEY);
		router.replace(redirectTo);
	}, [router, redirectTo]);

	// When login returns account_not_found, try sending a resume link in case
	// there's a pending registration for that email
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

	const handleRegisterInstead = useCallback(
		(email: string) => {
			localStorage.removeItem(REGISTRATION_STORAGE_KEY);
			setPendingRegistrationNotice(false);
			setResumeLinkSent(false);
			setRegisterFirstName('');
			setRegisterLastName('');
			setRegisterEmail(email);
			setRegisterPassword('');
			setRegisterStep('form');
			setVerificationCode('');
			setPasswordError('');
			didAutoFetchRef.current = false;
			registration.reset();
			setActiveTab('register');
		},
		[registration]
	);

	// Recover pending registration from URL query params (resume link) or localStorage
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const ridFromUrl = params.get('registration_rid');
		if (ridFromUrl) {
			setActiveTab('register');
			setRegisterStep('verify-email');
			return;
		}

		try {
			const saved = localStorage.getItem(REGISTRATION_STORAGE_KEY);
			if (saved) {
				const { email, rid } = JSON.parse(saved);
				if (rid) {
					registration.setRid(rid);
					if (email) setRegisterEmail(email);
					setRegisterStep('verify-email');
					setActiveTab('register');
				}
			}
		} catch {
			// ignore
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Auto-fetch registration data when rid is recovered (from URL or localStorage)
	useEffect(() => {
		if (didAutoFetchRef.current) return;
		if (!registration.rid) return;
		didAutoFetchRef.current = true;
		void registration.getRegistration();
	}, [registration.rid]);

	// Populate email from registration data once loaded (e.g. after resume link recovery)
	useEffect(() => {
		if (
			registration.registration?.email &&
			registerStep === 'verify-email' &&
			!registerEmail
		) {
			setRegisterEmail(registration.registration.email);
		}
	}, [registration.registration?.email, registerStep, registerEmail]);

	// Resend countdown timer
	useEffect(() => {
		if (resendCountdown <= 0) return;
		const interval = setInterval(() => {
			setResendCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(interval);
	}, [resendCountdown]);

	const handleTabChange = (value: string) => {
		setActiveTab(value as 'login' | 'register');
		// Remount LoginForm to reset its internal state
		if (value === 'login') {
			setLoginFormKey((k) => k + 1);
			setPendingRegistrationNotice(false);
		}
		// Reset registration state when switching away from register tab
		if (value !== 'register') {
			setRegisterStep('form');
			setVerificationCode('');
			setPasswordError('');
			setResumeLinkSent(false);
			didAutoFetchRef.current = false;
			registration.reset();
		}
	};

	// Track whether we need to auto-send the verification code after transitioning
	const needsVerificationCodeRef = useRef(false);

	// Auto-send verification code once the rid is available in state after registration creation
	useEffect(() => {
		if (!needsVerificationCodeRef.current) return;
		if (!registration.rid) return;
		if (registerStep !== 'verify-email') return;
		needsVerificationCodeRef.current = false;
		// Now that the rid is in state, persist it to localStorage
		localStorage.setItem(
			REGISTRATION_STORAGE_KEY,
			JSON.stringify({ email: registerEmail, rid: registration.rid })
		);
		void (async () => {
			const result = await registration.sendEmailVerificationCode();
			if (result.success) {
				const cooldown =
					result.data?.enable_resend_after ?? registration.enableResendAfter;
				if (cooldown) setResendCountdown(cooldown);
			}
		})();
	}, [registration.rid, registerStep]);

	const isRegisterFormComplete =
		registerEmail.trim() &&
		registerFirstName.trim() &&
		registerLastName.trim() &&
		registerPassword;
	const isRegistrationEmailVerified =
		registration.registration?.email_verified === true;

	const handleCreateRegistration = async () => {
		setPasswordError('');
		setResumeLinkSent(false);
		if (!registerFirstName.trim() || !registerLastName.trim()) {
			return;
		}
		if (!registerPassword) {
			setPasswordError('Password is required');
			return;
		}
		const success = await registration.createRegistration({
			registration_url: buildAbsoluteLoginHref(
				window.location.origin,
				redirectTo
			),
			email: registerEmail,
			password: registerPassword,
			registration_profile_data: {
				first_name: registerFirstName,
				last_name: registerLastName
			}
		});
		if (success) {
			// Transition to verify-email immediately; the useEffect above will send
			// the verification code and persist to localStorage once React re-renders
			// with the new rid in state.
			needsVerificationCodeRef.current = true;
			setRegisterStep('verify-email');
		} else if (registration.error === 'registration_flow_already_exists') {
			// A flow already exists for this email — send a resume link so the user can continue
			const sent = await registration.sendResumeLink(registerEmail);
			if (sent) setResumeLinkSent(true);
		}
	};

	const handleVerifyEmail = async () => {
		const success = await registration.verifyEmail(verificationCode);
		if (success) {
			await registration.finalizeRegistration();
		}
	};

	const handleRegisterWithSocial = (provider: string) => {
		const redirectUri = buildAbsoluteLoginHref(
			window.location.origin,
			redirectTo,
			'/'
		);
		const url = `${unidyClient.baseUrl}/api/sdk/v1/sign_ins/auth/omniauth/${provider}?sdk_redirect_uri=${encodeURIComponent(redirectUri)}`;
		window.location.href = url;
	};

	const handleResendVerificationCode = async () => {
		const result = await registration.sendEmailVerificationCode();
		if (result.success) {
			const cooldown =
				result.data?.enable_resend_after ?? registration.enableResendAfter;
			if (cooldown) setResendCountdown(cooldown);
		}
	};

	const handleRegistrationGoBack = () => {
		setRegisterStep('form');
		setVerificationCode('');
		setPasswordError('');
		registration.clearErrors();
	};

	return (
		<div
			className="flex flex-col items-center justify-center min-h-screen px-2 md:px-6 py-8"
			style={{
				backgroundImage:
					'linear-gradient(150.64deg, rgba(216, 106, 96, 1) 0%, rgba(199, 42, 28, 1) 50%, rgba(216, 106, 96, 1) 100%)'
			}}
		>
			<div className="flex flex-col items-center gap-8 w-full max-w-[448px] relative">
				{/* Cancel */}
				<Link
					href="/"
					className="absolute right-0 top-0 rounded-full size-10 flex items-center justify-center bg-white/15 hover:bg-white/25 transition-colors"
					aria-label="Back to homepage"
				>
					<X className="size-5 text-white" />
				</Link>

				{/* Header */}
				<div className="flex flex-col items-center gap-4">
					<div className="size-12 flex items-center justify-center bg-white rounded-full">
						<Lock className="size-7 text-theme" />
					</div>
					<h1 className="display-3 text-center text-accent-contrast">
						Welcome to FC Unidy
					</h1>
					<p className="title-2 text-center text-accent-contrast/60">
						Sign in to access your account
					</p>
				</div>

				{/* Card with Form */}
				<Card className="w-full rounded-[16px] py-10 px-6 sm:px-10">
					{/* Tabs and Content */}
					<ButtonTabs
						value={activeTab}
						onValueChange={handleTabChange}
						className="w-full"
					>
						<ButtonTabsList className="w-full">
							<ButtonTabsGroup className="w-full">
								<ButtonTabsTrigger value="login" className="flex-1">
									Login
								</ButtonTabsTrigger>
								<ButtonTabsTrigger
									value="register"
									className="flex-1"
									disabled={
										activeTab === 'login' &&
										loginStep !== 'idle' &&
										loginStep !== 'email'
									}
								>
									Register
								</ButtonTabsTrigger>
							</ButtonTabsGroup>
						</ButtonTabsList>

						{/* Login Content */}
						<ButtonTabsContent value="login" className="w-full mt-6">
							<LoginForm
								key={loginFormKey}
								returnTo={redirectTo}
								onAuthenticated={handleLoginAuthenticated}
								onStepChange={setLoginStep}
								onAccountNotFound={handleAccountNotFound}
								onRegisterInstead={handleRegisterInstead}
							/>
							{pendingRegistrationNotice && (
								<div className="border border-neutral-medium rounded-[10px] p-4 flex gap-4 items-start bg-neutral-weak mt-4">
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
						</ButtonTabsContent>

						{/* Register Content */}
						<ButtonTabsContent value="register" className="w-full mt-6">
							{registerStep === 'form' && (
								<div className="flex flex-col gap-6 w-full">
									<FormLabel
										title="Email Address"
										required
										error={translateAuthError(registration.fieldErrors.email)}
									>
										<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
											<InputGroupAddon>
												<Mail className="size-5 text-neutral-medium" />
											</InputGroupAddon>
											<InputGroupInput
												type="email"
												placeholder="you@example.com"
												value={registerEmail}
												onChange={(e) => setRegisterEmail(e.target.value)}
												onKeyDown={(e) =>
													e.key === 'Enter' && handleCreateRegistration()
												}
												required
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									<div className="flex gap-4">
										<FormLabel
											title="First Name"
											required
											className="flex-1"
											error={translateAuthError(
												registration.fieldErrors.first_name
											)}
										>
											<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
												<InputGroupAddon>
													<User className="size-5 text-neutral-medium" />
												</InputGroupAddon>
												<InputGroupInput
													type="text"
													placeholder="John"
													value={registerFirstName}
													onChange={(e) => setRegisterFirstName(e.target.value)}
													onKeyDown={(e) =>
														e.key === 'Enter' && handleCreateRegistration()
													}
													required
													className="text-neutral placeholder:text-neutral-medium"
												/>
											</InputGroup>
										</FormLabel>

										<FormLabel
											title="Last Name"
											required
											className="flex-1"
											error={translateAuthError(
												registration.fieldErrors.last_name
											)}
										>
											<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
												<InputGroupAddon>
													<User className="size-5 text-neutral-medium" />
												</InputGroupAddon>
												<InputGroupInput
													type="text"
													placeholder="Doe"
													value={registerLastName}
													onChange={(e) => setRegisterLastName(e.target.value)}
													onKeyDown={(e) =>
														e.key === 'Enter' && handleCreateRegistration()
													}
													required
													className="text-neutral placeholder:text-neutral-medium"
												/>
											</InputGroup>
										</FormLabel>
									</div>

									<FormLabel
										title="Password"
										required
										error={
											passwordError ||
											translateAuthError(registration.fieldErrors.password)
										}
									>
										<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
											<InputGroupAddon>
												<Lock className="size-5 text-neutral-medium" />
											</InputGroupAddon>
											<InputGroupInput
												type="password"
												placeholder="••••••••"
												value={registerPassword}
												onChange={(e) => {
													setRegisterPassword(e.target.value);
													if (passwordError) {
														setPasswordError('');
													}
												}}
												onKeyDown={(e) =>
													e.key === 'Enter' && handleCreateRegistration()
												}
												required
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									{resumeLinkSent && (
										<div className="border border-neutral-medium rounded-[10px] p-4 flex gap-4 items-start bg-neutral-weak">
											<CheckCircle2 className="size-10 text-theme shrink-0" />
											<div className="flex flex-col gap-1">
												<p className="body-1 text-neutral-strong font-semibold">
													Resume link sent!
												</p>
												<p className="body-2 text-neutral-strong">
													A registration is already in progress. Check your
													inbox for a link to continue.
												</p>
											</div>
										</div>
									)}

									{registration.error && !resumeLinkSent && (
										<p className="body-2 text-danger">
											{translateAuthError(registration.error)}
										</p>
									)}

									<Button
										theme="accent"
										variant="solid"
										size="lg"
										className="w-full"
										onClick={handleCreateRegistration}
										disabled={registration.isLoading || !isRegisterFormComplete}
									>
										{registration.isLoading ? 'Registering...' : 'Register'}
									</Button>

									<div className="flex items-center justify-center gap-2">
										<div className="flex-1 h-px bg-neutral-weak" />
										<p className="body-2 text-neutral-strong">
											or continue with
										</p>
										<div className="flex-1 h-px bg-neutral-weak" />
									</div>

									<SocialAuthButtons
										providers={['google']}
										onSelect={handleRegisterWithSocial}
										disabled={registration.isLoading}
									/>

									<div className="flex items-center justify-center gap-2">
										<p className="body-2 text-neutral-strong">
											Already have an account?
										</p>
										<Button
											type="button"
											onClick={() => setActiveTab('login')}
											size="link"
											variant="link"
										>
											Login
										</Button>
									</div>
								</div>
							)}

							{registerStep === 'verify-email' && (
								<div className="flex flex-col gap-6 w-full">
									{/* Locked Email */}
									<FormLabel title="Email Address" required>
										<InputGroup
											className="border-neutral-medium rounded-[10px] h-[50px] bg-neutral-weak"
											data-disabled="true"
										>
											<InputGroupAddon>
												<Mail className="size-5 text-neutral-medium" />
											</InputGroupAddon>
											<InputGroupInput
												type="email"
												value={
													registration.registration?.email ?? registerEmail
												}
												disabled
												className="text-neutral cursor-not-allowed"
											/>
										</InputGroup>
									</FormLabel>

									{isRegistrationEmailVerified ? (
										<>
											<div className="border border-neutral-medium rounded-[10px] p-4 flex gap-4 items-start bg-neutral-weak">
												<CheckCircle2 className="size-10 text-theme shrink-0" />
												<div className="flex flex-col gap-1">
													<p className="body-1 text-neutral-strong font-semibold">
														Email verified
													</p>
													<p className="body-2 text-neutral-strong">
														Your email has been verified. Click below to
														complete your registration.
													</p>
												</div>
											</div>

											{registration.error && (
												<p className="body-2 text-danger">
													{translateAuthError(registration.error)}
												</p>
											)}

											<Button
												theme="accent"
												variant="solid"
												size="lg"
												className="w-full"
												onClick={() => registration.finalizeRegistration()}
												disabled={registration.isLoading}
											>
												{registration.isLoading
													? 'Completing...'
													: 'Complete Registration'}
											</Button>
										</>
									) : (
										<>
											<FormLabel title="Verification Code" required>
												<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
													<InputGroupAddon>
														<ShieldCheck className="size-5 text-neutral-medium" />
													</InputGroupAddon>
													<InputGroupInput
														type="text"
														placeholder="Enter 4-digit code"
														value={verificationCode}
														onChange={(e) =>
															setVerificationCode(e.target.value)
														}
														onKeyDown={(e) =>
															e.key === 'Enter' && handleVerifyEmail()
														}
														inputMode="numeric"
														maxLength={4}
														className="text-neutral placeholder:text-neutral-medium"
													/>
												</InputGroup>
											</FormLabel>

											<p className="body-2 text-neutral-strong text-center">
												A 4-digit verification code has been sent to your email.
											</p>

											{registration.error && (
												<p className="body-2 text-danger">
													{translateAuthError(registration.error)}
												</p>
											)}

											<Button
												theme="accent"
												variant="solid"
												size="lg"
												className="w-full"
												onClick={handleVerifyEmail}
												disabled={registration.isLoading}
											>
												{registration.isLoading
													? 'Verifying...'
													: 'Verify & Complete Registration'}
											</Button>

											{/* Resend code */}
											<div className="flex justify-center">
												<Button
													type="button"
													size="link"
													variant="link"
													onClick={handleResendVerificationCode}
													disabled={
														registration.isLoading || resendCountdown > 0
													}
												>
													{resendCountdown > 0
														? `Resend code in ${formatDuration(intervalToDuration({ start: 0, end: resendCountdown * 1000 }))}`
														: 'Resend code'}
												</Button>
											</div>
										</>
									)}

									{/* Back button */}
									<Button
										theme="neutral"
										variant="outline"
										size="md"
										className="w-full"
										onClick={handleRegistrationGoBack}
									>
										<ArrowLeft className="size-4" />
										Back
									</Button>
								</div>
							)}
						</ButtonTabsContent>
					</ButtonTabs>
				</Card>

				{/* Footer */}
				<p className="body-3 text-accent-contrast text-center opacity-75">
					Powered by Unidy Auth SDK
				</p>
			</div>
		</div>
	);
};
