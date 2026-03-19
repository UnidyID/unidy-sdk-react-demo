'use client';

import { useRegistration } from '@unidy.io/sdk-react';
import { formatDuration, intervalToDuration } from 'date-fns';
import { ArrowLeft, CheckCircle2, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from '@/components/shadcn/ui/input-group';
import { mutationCallbackOptions } from '@/deps/unidy/callbacks';
import { translateAuthError } from '@/locales/translate-auth-error';
import { hydrateAuthFromPayload } from '@/modules/authentication/utils/hydrate-auth';
import {
	buildAbsoluteLoginHref,
	useCurrentReturnTo
} from '@/modules/authentication/utils/return-to';
import { useRouter } from 'next/navigation';

interface RegisterExampleProps {
	initialEmail?: string;
	onLoginInstead?: () => void;
}

export const RegisterExample = ({
	initialEmail,
	onLoginInstead
}: RegisterExampleProps) => {
	const router = useRouter();
	const returnTo = useCurrentReturnTo('/');
	const registration = useRegistration({ callbacks: mutationCallbackOptions });
	const resetRegistration = registration.reset;
	const sendEmailVerificationCode = registration.sendEmailVerificationCode;

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
	const needsVerificationCodeRef = useRef(false);

	useEffect(() => {
		if (!initialEmail) return;

		registration.reset();
		setRegisterFirstName('');
		setRegisterLastName('');
		setRegisterEmail(initialEmail);
		setRegisterPassword('');
		setRegisterStep('form');
		setVerificationCode('');
		setPasswordError('');
		setResendCountdown(0);
		needsVerificationCodeRef.current = false;
	}, [initialEmail, resetRegistration]);

	useEffect(() => {
		const auth = registration.registration?.auth;
		if (!auth) return;

		hydrateAuthFromPayload({
			auth,
			email: registration.registration?.email ?? registerEmail
		});
		router.refresh();
	}, [registration.registration?.auth, registration.registration?.email, registerEmail, router]);

	useEffect(() => {
		if (!needsVerificationCodeRef.current) return;
		if (!registration.rid) return;
		if (registerStep !== 'verify-email') return;

		needsVerificationCodeRef.current = false;
		void (async () => {
			const result = await sendEmailVerificationCode();
			if (result.success) {
				const cooldown =
					result.data?.enable_resend_after ?? registration.enableResendAfter;
				if (cooldown) setResendCountdown(cooldown);
			}
		})();
	}, [
		registration.rid,
		registerStep,
		sendEmailVerificationCode,
		registration.enableResendAfter
	]);

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

	const isRegisterFormComplete =
		registerEmail.trim() &&
		registerFirstName.trim() &&
		registerLastName.trim() &&
		registerPassword;
	const isRegistrationEmailVerified =
		registration.registration?.email_verified === true;

	const handleCreateRegistration = async () => {
		setPasswordError('');
		if (!registerFirstName.trim() || !registerLastName.trim()) return;
		if (!registerPassword) {
			setPasswordError('Password is required');
			return;
		}

		const success = await registration.createRegistration({
			registration_url: buildAbsoluteLoginHref(
				window.location.origin,
				returnTo
			),
			email: registerEmail.trim().toLowerCase(),
			password: registerPassword,
			registration_profile_data: {
				first_name: registerFirstName,
				last_name: registerLastName
			}
		});

		if (success) {
			needsVerificationCodeRef.current = true;
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
		setPasswordError('');
		registration.clearErrors();
	};

	return (
		<div className="flex flex-col gap-6 w-full">
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
							className="flex-1"
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
						onClick={handleCreateRegistration}
						disabled={registration.isLoading || !isRegisterFormComplete}
					>
						{registration.isLoading ? 'Registering...' : 'Register'}
					</Button>

					{onLoginInstead && (
						<Button
							type="button"
							theme="neutral"
							variant="outline"
							size="lg"
							className="w-full"
							onClick={onLoginInstead}
						>
							Log in instead
						</Button>
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

							<div className="flex justify-center">
								<Button
									type="button"
									size="link"
									variant="link"
									onClick={handleResendVerificationCode}
									disabled={registration.isLoading || resendCountdown > 0}
								>
									{resendCountdown > 0
										? `Resend code in ${formatDuration(
												intervalToDuration({
													start: 0,
													end: resendCountdown * 1000
												})
											)}`
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
		</div>
	);
};
