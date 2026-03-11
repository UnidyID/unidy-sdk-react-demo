'use client';

import { useRegistration } from '@unidy.io/sdk-react';
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
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { toastCallbacks } from '@/deps/unidy/callbacks';
import { translateAuthError } from '@/locales/translate-auth-error';
import { LoginForm } from '../components/login-form';

const REGISTRATION_STORAGE_KEY = 'unidy_pending_registration';

export const LoginPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = useMemo(
		() => searchParams.get('redirect') || '/profile',
		[searchParams]
	);
	const registration = useRegistration({ callbacks: toastCallbacks });

	const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
	// Key to force LoginForm remount when switching tabs (resets its internal state)
	const [loginFormKey, setLoginFormKey] = useState(0);
	const [loginStep, setLoginStep] = useState('idle');

	// Register form state
	const [registerFirstName, setRegisterFirstName] = useState('');
	const [registerLastName, setRegisterLastName] = useState('');
	const [registerEmail, setRegisterEmail] = useState('');
	const [registerPassword, setRegisterPassword] = useState('');
	const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
	const [registerStep, setRegisterStep] = useState<'form' | 'verify-email'>(
		'form'
	);
	const [verificationCode, setVerificationCode] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [resendCountdown, setResendCountdown] = useState(0);
	const [resumeLinkSent, setResumeLinkSent] = useState(false);
	const didAutoFetchRef = useRef(false);

	// Redirect on successful registration auth & clear localStorage
	useEffect(() => {
		if (registration.registration?.auth) {
			localStorage.removeItem(REGISTRATION_STORAGE_KEY);
			router.push(redirectTo);
		}
	}, [registration.registration?.auth, router, redirectTo]);

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
		}
		// Reset registration state when switching away from register tab
		if (value !== 'register') {
			setRegisterStep('form');
			setVerificationCode('');
			setConfirmPasswordError('');
			setResumeLinkSent(false);
			didAutoFetchRef.current = false;
			registration.reset();
		}
	};

	const handleCreateRegistration = async () => {
		setConfirmPasswordError('');
		setResumeLinkSent(false);
		if (!registerFirstName.trim() || !registerLastName.trim()) {
			return;
		}
		if (!registerPassword) {
			setConfirmPasswordError('Password is required');
			return;
		}
		if (registerPassword !== registerConfirmPassword) {
			setConfirmPasswordError('Passwords do not match');
			return;
		}
		const success = await registration.createRegistration({
			registration_url: window.location.origin + '/login',
			email: registerEmail,
			password: registerPassword,
			registration_profile_data: {
				first_name: registerFirstName,
				last_name: registerLastName
			}
		});
		if (success) {
			await transitionToVerifyEmail();
		} else if (registration.error === 'registration_flow_already_exists') {
			// A flow already exists for this email — send a resume link so the user can continue
			const sent = await registration.sendResumeLink(registerEmail);
			if (sent) setResumeLinkSent(true);
		}
	};

	const transitionToVerifyEmail = async () => {
		const result = await registration.sendEmailVerificationCode();
		if (result.success) {
			const cooldown =
				result.data?.enable_resend_after ?? registration.enableResendAfter;
			if (cooldown) setResendCountdown(cooldown);
			localStorage.setItem(
				REGISTRATION_STORAGE_KEY,
				JSON.stringify({ email: registerEmail, rid: registration.rid })
			);
			setRegisterStep('verify-email');
		}
	};

	const handleVerifyEmail = async () => {
		const success = await registration.verifyEmail(verificationCode);
		if (success) {
			await registration.finalizeRegistration();
		}
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
		setConfirmPasswordError('');
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
								onAuthenticated={() => router.push(redirectTo)}
								onStepChange={setLoginStep}
							/>
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
													className="text-neutral placeholder:text-neutral-medium"
												/>
											</InputGroup>
										</FormLabel>
									</div>

									<FormLabel
										title="Password"
										required
										error={translateAuthError(
											registration.fieldErrors.password
										)}
									>
										<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
											<InputGroupAddon>
												<Lock className="size-5 text-neutral-medium" />
											</InputGroupAddon>
											<InputGroupInput
												type="password"
												placeholder="••••••••"
												value={registerPassword}
												onChange={(e) => setRegisterPassword(e.target.value)}
												onKeyDown={(e) =>
													e.key === 'Enter' && handleCreateRegistration()
												}
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									<FormLabel
										title="Confirm Password"
										required
										error={confirmPasswordError}
									>
										<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
											<InputGroupAddon>
												<Lock className="size-5 text-neutral-medium" />
											</InputGroupAddon>
											<InputGroupInput
												type="password"
												placeholder="••••••••"
												value={registerConfirmPassword}
												onChange={(e) =>
													setRegisterConfirmPassword(e.target.value)
												}
												onKeyDown={(e) =>
													e.key === 'Enter' && handleCreateRegistration()
												}
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
										disabled={registration.isLoading}
									>
										{registration.isLoading ? 'Registering...' : 'Register'}
									</Button>

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

									<FormLabel title="Verification Code" required>
										<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
											<InputGroupAddon>
												<ShieldCheck className="size-5 text-neutral-medium" />
											</InputGroupAddon>
											<InputGroupInput
												type="text"
												placeholder="Enter 6-digit code"
												value={verificationCode}
												onChange={(e) => setVerificationCode(e.target.value)}
												onKeyDown={(e) =>
													e.key === 'Enter' && handleVerifyEmail()
												}
												maxLength={6}
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									<p className="body-2 text-neutral-strong text-center">
										A 6-digit verification code has been sent to your email.
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
											disabled={registration.isLoading || resendCountdown > 0}
										>
											{resendCountdown > 0
												? `Resend code in ${resendCountdown}s`
												: 'Resend code'}
										</Button>
									</div>

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
