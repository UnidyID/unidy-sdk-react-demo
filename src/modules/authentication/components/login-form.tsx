'use client';

import { useLogin } from '@unidy.io/sdk-react';
import { formatDuration, intervalToDuration } from 'date-fns';
import {
	ArrowLeft,
	CheckCircle2,
	KeyRound,
	Lock,
	Mail,
	Send
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from '@/components/shadcn/ui/input-group';
import { mutationCallbackOptions } from '@/deps/unidy/callbacks';
import { translateAuthError } from '@/locales/translate-auth-error';
import {
	SocialAuthButtons,
	visibleSocialProviders
} from './social-auth-buttons';
import { buildAbsoluteLoginHref } from '../utils/return-to';

interface LoginFormProps {
	/** Called when login.step becomes 'authenticated' */
	onAuthenticated?: () => void;
	/** Called whenever the login step changes */
	onStepChange?: (step: string) => void;
	/** Called when submitEmail returns account_not_found, with the email that was tried */
	onAccountNotFound?: (
		email: string
	) => Promise<'resume-link-sent' | 'registration-flow-not-found' | 'error'>;
	/** Called when the user should be redirected into the registration flow */
	onRegisterInstead?: (email: string) => void;
	returnTo?: string;
}

export const LoginForm = ({
	onAuthenticated,
	onStepChange,
	onAccountNotFound,
	onRegisterInstead,
	returnTo
}: LoginFormProps) => {
	const login = useLogin({ callbacks: mutationCallbackOptions });

	const [emailInput, setEmailInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');
	const [magicCodeInput, setMagicCodeInput] = useState('');
	const [emailStepAction, setEmailStepAction] = useState<
		'continue' | 'checking-resume' | 'register'
	>('continue');
	const lastSubmittedEmailRef = useRef<string | null>(null);
	const lastResumedAccountLookupRef = useRef<string | null>(null);

	// Magic code resend timer: handle both duration-in-ms and absolute-timestamp shapes
	const [magicCodeRemainingMs, setMagicCodeRemainingMs] = useState(0);
	const initialMagicCodeMs = useMemo(() => {
		if (!login.magicCodeResendAfter) return 0;
		return login.magicCodeResendAfter > 1_000_000_000_000
			? Math.max(0, login.magicCodeResendAfter - Date.now())
			: Math.max(0, login.magicCodeResendAfter);
	}, [login.magicCodeResendAfter]);

	useEffect(() => {
		setMagicCodeRemainingMs(initialMagicCodeMs);
	}, [initialMagicCodeMs]);

	useEffect(() => {
		if (magicCodeRemainingMs <= 0) return;
		const timer = setInterval(() => {
			setMagicCodeRemainingMs((prev) => Math.max(0, prev - 1000));
		}, 1000);
		return () => clearInterval(timer);
	}, [magicCodeRemainingMs]);

	// Notify parent on step changes
	useEffect(() => {
		onStepChange?.(login.step);
		if (login.step === 'authenticated') {
			onAuthenticated?.();
		}
	}, [login.step, onAuthenticated, onStepChange]);

	const handleSubmitEmail = async () => {
		const normalizedEmail = emailInput.trim().toLowerCase();
		if (!normalizedEmail) return;

		if (lastSubmittedEmailRef.current !== normalizedEmail) {
			lastResumedAccountLookupRef.current = null;
		}
		lastSubmittedEmailRef.current = normalizedEmail;
		setEmailStepAction('continue');

		await login.submitEmail(normalizedEmail);
	};

	// Notify parent when account_not_found so it can check for pending registrations
	useEffect(() => {
		if (login.errors.email !== 'account_not_found') return;

		const normalizedEmail = lastSubmittedEmailRef.current;
		if (!normalizedEmail) return;
		if (lastResumedAccountLookupRef.current === normalizedEmail) return;

		lastResumedAccountLookupRef.current = normalizedEmail;
		setEmailStepAction('checking-resume');

		void (async () => {
			const result = (await onAccountNotFound?.(normalizedEmail)) ?? 'error';
			if (lastSubmittedEmailRef.current !== normalizedEmail) return;

			setEmailStepAction(
				result === 'registration-flow-not-found' ? 'register' : 'continue'
			);
		})();
	}, [login.errors.email, onAccountNotFound]);

	const handleSubmitPassword = async () => {
		await login.submitPassword(passwordInput);
	};

	const handleSubmitMagicCode = async () => {
		await login.submitMagicCode(magicCodeInput);
	};

	const handleSocialAuth = (provider: string) => {
		const url = login.getSocialAuthUrl(
			provider,
			buildAbsoluteLoginHref(window.location.origin, returnTo, '/')
		);
		window.location.href = url;
	};

	const handleGoBack = () => {
		login.restart();
		setPasswordInput('');
		setMagicCodeInput('');
	};

	const isEmailStep = login.step === 'idle' || login.step === 'email';
	const isVerificationStep = login.step === 'verification';
	const isPasswordStep = login.step === 'password';
	const isMagicCodeStep = login.step === 'magic-code';
	const isResetPasswordStep = login.step === 'reset-password';
	const availableSocialProviders = visibleSocialProviders(
		login.loginOptions?.social_logins ?? []
	);
	const showRegisterInstead =
		emailStepAction === 'register' &&
		!!onRegisterInstead &&
		!!emailInput.trim();
	const emailStepButtonLabel =
		emailStepAction === 'checking-resume'
			? 'Checking for pending registration...'
			: login.isLoading
				? 'Loading...'
				: 'Continue';

	return (
		<>
			{/* Email Step */}
			{isEmailStep && (
				<form
					className="flex flex-col gap-6 w-full"
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmitEmail();
					}}
				>
					<FormLabel title="Email Address" required>
						<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
							<InputGroupAddon>
								<Mail className="size-5 text-neutral-medium" />
							</InputGroupAddon>
							<InputGroupInput
								type="email"
								placeholder="you@example.com"
								value={emailInput}
								onChange={(e) => {
									const nextEmail = e.target.value;
									const normalizedNextEmail = nextEmail.trim().toLowerCase();
									setEmailInput(nextEmail);

									if (
										normalizedNextEmail !== lastSubmittedEmailRef.current
									) {
										lastSubmittedEmailRef.current = null;
										lastResumedAccountLookupRef.current = null;
										setEmailStepAction('continue');
									}
								}}
								required
								className="text-neutral placeholder:text-neutral-medium"
							/>
						</InputGroup>
					</FormLabel>

					{login.errors.email && (
						<p className="body-2 text-red-500">
							{translateAuthError(login.errors.email)}
						</p>
					)}

					<Button
						theme="accent"
						variant="solid"
						size="lg"
						className="w-full"
						type="submit"
						disabled={
							login.isLoading ||
							emailStepAction === 'checking-resume' ||
							!emailInput.trim()
						}
					>
						{emailStepButtonLabel}
					</Button>

					{showRegisterInstead && (
						<Button
							type="button"
							theme="neutral"
							variant="outline"
							size="lg"
							className="w-full"
							onClick={() => onRegisterInstead?.(emailInput.trim().toLowerCase())}
						>
							Register instead
						</Button>
					)}

					<div className="flex items-center justify-center gap-2">
						<div className="flex-1 h-px bg-neutral-weak" />
						<p className="body-2 text-neutral-strong">or continue with</p>
						<div className="flex-1 h-px bg-neutral-weak" />
					</div>

					<SocialAuthButtons
						providers={['google']}
						onSelect={handleSocialAuth}
						disabled={login.isLoading}
					/>

					<Button
						type="button"
						theme="neutral"
						variant="outline"
						size="lg"
						className="w-full"
						onClick={() => login.authenticateWithPasskey()}
						disabled={login.isLoading}
					>
						<KeyRound className="size-5" />
						{login.isLoading ? 'Authenticating...' : 'Sign in with Passkey'}
					</Button>

					{login.errors.passkey && (
						<p className="body-2 text-red-500">
							{translateAuthError(login.errors.passkey)}
						</p>
					)}
				</form>
			)}

			{/* Verification Step - show available login methods */}
			{isVerificationStep && (
				<div className="flex flex-col gap-3 w-full">
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
								value={login.email}
								disabled
								className="text-neutral cursor-not-allowed"
							/>
						</InputGroup>
					</FormLabel>

					{login.loginOptions?.password && (
						<Button
							theme="accent"
							variant="solid"
							size="lg"
							className="w-full"
							onClick={() => login.goToStep('password')}
							disabled={login.isLoading}
						>
							<Lock className="size-5" />
							Continue with Password
						</Button>
					)}

					{login.loginOptions?.magic_link && (
						<Button
							theme="accent"
							variant="solid-weak"
							size="lg"
							className="w-full"
							onClick={() => login.sendMagicCode()}
							disabled={login.isLoading}
						>
							<Send className="size-5" />
							Send Magic Code
						</Button>
					)}

					{login.loginOptions?.passkey && (
						<>
							<Button
								theme="accent"
								variant="solid-weak"
								size="lg"
								className="w-full"
								onClick={() => login.authenticateWithPasskey()}
								disabled={login.isLoading}
							>
								<KeyRound className="size-5" />
								{login.isLoading ? 'Authenticating...' : 'Continue with Passkey'}
							</Button>
							{login.errors.passkey && (
								<p className="body-2 text-red-500">
									{translateAuthError(login.errors.passkey)}
								</p>
							)}
						</>
					)}

					{availableSocialProviders.length > 0 && (
						<>
							<div className="flex items-center justify-center gap-2">
								<div className="flex-1 h-px bg-neutral-weak" />
								<p className="body-2 text-neutral-strong">or continue with</p>
								<div className="flex-1 h-px bg-neutral-weak" />
							</div>

							<SocialAuthButtons
								providers={availableSocialProviders}
								onSelect={handleSocialAuth}
								disabled={login.isLoading}
							/>
						</>
					)}

					{login.errors.global && (
						<p className="body-2 text-red-500">
							{translateAuthError(login.errors.global)}
						</p>
					)}

					<Button
						theme="neutral"
						variant="outline"
						size="md"
						className="w-full"
						onClick={handleGoBack}
					>
						<ArrowLeft className="size-4" />
						Back
					</Button>
				</div>
			)}

			{/* Password Step */}
			{isPasswordStep && (
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
								value={login.email}
								disabled
								className="text-neutral cursor-not-allowed"
							/>
						</InputGroup>
					</FormLabel>

					<FormLabel title="Password" required>
						<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
							<InputGroupAddon>
								<Lock className="size-5 text-neutral-medium" />
							</InputGroupAddon>
							<InputGroupInput
								type="password"
								placeholder="••••••••"
								value={passwordInput}
								onChange={(e) => setPasswordInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleSubmitPassword()}
								className="text-neutral placeholder:text-neutral-medium"
							/>
						</InputGroup>
					</FormLabel>

					{login.errors.password && (
						<p className="body-2 text-red-500">
							{translateAuthError(login.errors.password)}
						</p>
					)}

					<div className="flex justify-end">
						<Button
							type="button"
							size="link"
							variant="link"
							onClick={() => login.goToStep('reset-password')}
						>
							Forgot password?
						</Button>
					</div>

					<Button
						theme="accent"
						variant="solid"
						size="lg"
						className="w-full"
						onClick={handleSubmitPassword}
						disabled={login.isLoading}
					>
						{login.isLoading ? 'Signing in...' : 'Sign In'}
					</Button>

					{login.errors.global && (
						<p className="body-2 text-red-500">
							{translateAuthError(login.errors.global)}
						</p>
					)}

					{login.canGoBack && (
						<Button
							theme="neutral"
							variant="outline"
							size="md"
							className="w-full"
							onClick={handleGoBack}
						>
							<ArrowLeft className="size-4" />
							Back
						</Button>
					)}
				</div>
			)}

			{/* Magic Code Step */}
			{isMagicCodeStep && (
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
								value={login.email}
								disabled
								className="text-neutral cursor-not-allowed"
							/>
						</InputGroup>
					</FormLabel>

					<FormLabel title="Magic Code" required>
						<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
							<InputGroupAddon>
								<KeyRound className="size-5 text-neutral-medium" />
							</InputGroupAddon>
							<InputGroupInput
								type="text"
								placeholder="Enter 4-digit code"
								value={magicCodeInput}
								onChange={(e) => setMagicCodeInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleSubmitMagicCode()}
								maxLength={4}
								className="text-neutral placeholder:text-neutral-medium"
							/>
						</InputGroup>
					</FormLabel>

					{login.errors.magicCode && (
						<p className="body-2 text-red-500">
							{translateAuthError(login.errors.magicCode)}
						</p>
					)}

					<p className="body-2 text-neutral-strong text-center">
						A 4-digit code has been sent to your email.
					</p>

					<Button
						theme="accent"
						variant="solid"
						size="lg"
						className="w-full"
						onClick={handleSubmitMagicCode}
						disabled={login.isLoading}
					>
						{login.isLoading ? 'Verifying...' : 'Verify Code'}
					</Button>

					<div className="flex justify-center">
						<Button
							type="button"
							size="link"
							variant="link"
							onClick={() => login.sendMagicCode()}
							disabled={
								login.isLoading || Math.ceil(magicCodeRemainingMs / 1000) > 0
							}
						>
							{Math.ceil(magicCodeRemainingMs / 1000) > 0
								? `Resend code in ${formatDuration(intervalToDuration({ start: 0, end: Math.ceil(magicCodeRemainingMs / 1000) * 1000 }))}`
								: 'Resend code'}
						</Button>
					</div>

					{login.errors.global && (
						<p className="body-2 text-red-500">
							{translateAuthError(login.errors.global)}
						</p>
					)}

					{login.canGoBack && (
						<Button
							theme="neutral"
							variant="outline"
							size="md"
							className="w-full"
							onClick={handleGoBack}
						>
							<ArrowLeft className="size-4" />
							Back
						</Button>
					)}
				</div>
			)}

			{/* Reset Password Step */}
			{isResetPasswordStep && (
				<div className="flex flex-col gap-6 w-full">
					{login.resetPasswordStep === 'idle' ? (
						<>
							<div className="flex flex-col gap-2 text-center">
								<h2 className="title-1 text-neutral">Reset Password</h2>
								<p className="body-2 text-neutral-strong">
									We&apos;ll send a password reset link to{' '}
									<strong>{login.email}</strong>.
								</p>
							</div>

							{login.errors.resetPassword && (
								<p className="body-2 text-red-500">
									{translateAuthError(login.errors.resetPassword)}
								</p>
							)}

							<Button
								theme="accent"
								variant="solid"
								size="lg"
								className="w-full"
								onClick={() => login.sendResetPasswordEmail()}
								disabled={login.isLoading}
							>
								{login.isLoading ? 'Sending...' : 'Send Reset Email'}
							</Button>
						</>
					) : (
						<div className="border border-neutral-medium rounded-[10px] p-4 flex gap-4 items-start bg-neutral-weak">
							<CheckCircle2 className="size-10 text-theme shrink-0" />
							<div className="flex flex-col gap-1">
								<p className="body-1 text-neutral-strong font-semibold">
									Reset email sent!
								</p>
								<p className="body-2 text-neutral-strong">
									Please check your inbox for the password reset link.
								</p>
							</div>
						</div>
					)}

					{login.errors.global && (
						<p className="body-2 text-red-500">
							{translateAuthError(login.errors.global)}
						</p>
					)}

					{login.canGoBack && (
						<Button
							theme="neutral"
							variant="outline"
							size="md"
							className="w-full"
							onClick={handleGoBack}
						>
							<ArrowLeft className="size-4" />
							Back
						</Button>
					)}
				</div>
			)}
		</>
	);
};
