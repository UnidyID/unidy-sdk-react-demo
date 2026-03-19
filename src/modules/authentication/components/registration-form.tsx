'use client';

import { authStorage, useRegistration, useSession } from '@unidy.io/sdk-react';
import { formatDuration, intervalToDuration } from 'date-fns';
import { ArrowLeft, CheckCircle2, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from '@/components/shadcn/ui/input-group';
import { mutationCallbackOptions } from '@/deps/unidy/callbacks';
import { unidyClient } from '@/deps/unidy/client';
import { translateAuthError } from '@/locales/translate-auth-error';
import { SocialAuthButtons } from './social-auth-buttons';
import { buildAbsoluteLoginHref } from '../utils/return-to';

const REGISTRATION_STORAGE_KEY = 'unidy_pending_registration';

const decodeSignInIdFromToken = (token: string) => {
	try {
		const [, payload] = token.split('.');
		if (!payload) return null;

		const decodedPayload = JSON.parse(atob(payload)) as { sid?: unknown };
		return typeof decodedPayload.sid === 'string' ? decodedPayload.sid : null;
	} catch {
		return null;
	}
};

interface RegistrationFormProps {
	returnTo?: string;
	initialEmail?: string;
	autoRecover?: boolean;
	onAuthenticated?: () => void;
	onSwitchToLogin?: () => void;
}

export const RegistrationForm = ({
	returnTo,
	initialEmail,
	autoRecover = false,
	onAuthenticated,
	onSwitchToLogin
}: RegistrationFormProps) => {
	const session = useSession();
	const registration = useRegistration({ callbacks: mutationCallbackOptions });

	const [registerFirstName, setRegisterFirstName] = useState('');
	const [registerLastName, setRegisterLastName] = useState('');
	const [registerEmail, setRegisterEmail] = useState(initialEmail ?? '');
	const [registerPassword, setRegisterPassword] = useState('');
	const [registerStep, setRegisterStep] = useState<'form' | 'verify-email'>(
		'form'
	);
	const [verificationCode, setVerificationCode] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [resendCountdown, setResendCountdown] = useState(0);
	const [resumeLinkSent, setResumeLinkSent] = useState(false);
	const didAutoFetchRef = useRef(false);
	const needsVerificationCodeRef = useRef(false);
	const didHandleAuthenticationRef = useRef(false);

	useEffect(() => {
		if (registerStep !== 'form') return;
		if (!initialEmail) return;
		setRegisterEmail(initialEmail);
	}, [initialEmail, registerStep]);

	useEffect(() => {
		if (didHandleAuthenticationRef.current) return;

		const auth = registration.registration?.auth;
		if (!auth) return;

		didHandleAuthenticationRef.current = true;
		authStorage.setToken(auth.id_token);
		authStorage.setRefreshToken(auth.refresh_token);
		authStorage.setRecoverableStep(null);
		authStorage.setMagicCodeStep(null);

		const signInId = decodeSignInIdFromToken(auth.id_token);
		if (signInId) {
			authStorage.setSignInId(signInId);
		}

		const email = registration.registration?.email ?? registerEmail;
		if (email) {
			authStorage.setEmail(email);
		}

		localStorage.removeItem(REGISTRATION_STORAGE_KEY);
		onAuthenticated?.();
	}, [
		onAuthenticated,
		registerEmail,
		registration.registration?.auth,
		registration.registration?.email
	]);

	useEffect(() => {
		if (didHandleAuthenticationRef.current) return;
		if (!session.isAuthenticated) return;

		didHandleAuthenticationRef.current = true;
		localStorage.removeItem(REGISTRATION_STORAGE_KEY);
		onAuthenticated?.();
	}, [onAuthenticated, session.isAuthenticated]);

	useEffect(() => {
		if (!autoRecover) return;

		const params = new URLSearchParams(window.location.search);
		const ridFromUrl = params.get('registration_rid');
		if (ridFromUrl) {
			registration.setRid(ridFromUrl);
			setRegisterStep('verify-email');
			return;
		}

		try {
			const saved = localStorage.getItem(REGISTRATION_STORAGE_KEY);
			if (saved) {
				const { email, rid } = JSON.parse(saved) as {
					email?: string;
					rid?: string;
				};
				if (rid) {
					registration.setRid(rid);
					if (email) setRegisterEmail(email);
					setRegisterStep('verify-email');
				}
			}
		} catch {
			// ignore persisted state parse errors
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoRecover]);

	useEffect(() => {
		if (!autoRecover) return;
		if (didAutoFetchRef.current) return;
		if (!registration.rid) return;

		didAutoFetchRef.current = true;
		void registration.getRegistration();
	}, [autoRecover, registration.rid]);

	useEffect(() => {
		if (
			registration.registration?.email &&
			registerStep === 'verify-email' &&
			!registerEmail
		) {
			setRegisterEmail(registration.registration.email);
		}
	}, [registration.registration?.email, registerStep, registerEmail]);

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

	useEffect(() => {
		if (!needsVerificationCodeRef.current) return;
		if (!registration.rid) return;
		if (registerStep !== 'verify-email') return;

		needsVerificationCodeRef.current = false;
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
	}, [registerEmail, registerStep, registration.enableResendAfter, registration.rid]);

	const resetRegistrationState = useCallback(() => {
		localStorage.removeItem(REGISTRATION_STORAGE_KEY);
		setRegisterFirstName('');
		setRegisterLastName('');
		setRegisterEmail(initialEmail ?? '');
		setRegisterPassword('');
		setRegisterStep('form');
		setVerificationCode('');
		setPasswordError('');
		setResumeLinkSent(false);
		setResendCountdown(0);
		didAutoFetchRef.current = false;
		needsVerificationCodeRef.current = false;
		registration.reset();
	}, [initialEmail, registration]);

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
				returnTo
			),
			email: registerEmail,
			password: registerPassword,
			registration_profile_data: {
				first_name: registerFirstName,
				last_name: registerLastName
			}
		});

		if (success) {
			needsVerificationCodeRef.current = true;
			setRegisterStep('verify-email');
		} else if (registration.error === 'registration_flow_already_exists') {
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
			returnTo,
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

	const handleSwitchToLogin = () => {
		resetRegistrationState();
		onSwitchToLogin?.();
	};

	return (
		<>
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

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<FormLabel
							title="First Name"
							required
							error={translateAuthError(registration.fieldErrors.first_name)}
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
							error={translateAuthError(registration.fieldErrors.last_name)}
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
									A registration is already in progress. Check your inbox for a
									link to continue.
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
						<p className="body-2 text-neutral-strong">or continue with</p>
						<div className="flex-1 h-px bg-neutral-weak" />
					</div>

					<SocialAuthButtons
						providers={['google']}
						onSelect={handleRegisterWithSocial}
						disabled={registration.isLoading}
					/>

					{onSwitchToLogin && (
						<div className="flex items-center justify-center gap-2">
							<p className="body-2 text-neutral-strong">
								Already have an account?
							</p>
							<Button
								type="button"
								onClick={handleSwitchToLogin}
								size="link"
								variant="link"
							>
								Login
							</Button>
						</div>
					)}
				</div>
			)}

			{registerStep === 'verify-email' && (
				<div className="flex flex-col gap-6 w-full">
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
								value={registration.registration?.email ?? registerEmail}
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
										Your email has been verified. Click below to complete your
										registration.
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
								{registration.isLoading ? 'Completing...' : 'Complete Registration'}
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
										onChange={(e) => setVerificationCode(e.target.value)}
										onKeyDown={(e) => e.key === 'Enter' && handleVerifyEmail()}
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

							<div className="flex justify-center">
								<Button
									type="button"
									size="link"
									variant="link"
									onClick={handleResendVerificationCode}
									disabled={registration.isLoading || resendCountdown > 0}
								>
									{resendCountdown > 0
										? `Resend code in ${formatDuration(intervalToDuration({ start: 0, end: resendCountdown * 1000 }))}`
										: 'Resend code'}
								</Button>
							</div>
						</>
					)}

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
		</>
	);
};
