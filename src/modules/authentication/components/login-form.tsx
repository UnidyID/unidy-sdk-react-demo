'use client';

import { ArrowLeft, CheckCircle2, KeyRound, Lock, Mail, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useLogin } from '@unidy.io/sdk-react';
import { toastCallbacks } from '@/deps/unidy/callbacks';

import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from '@/components/shadcn/ui/input-group';

interface LoginFormProps {
	/** Called when login.step becomes 'authenticated' */
	onAuthenticated?: () => void;
	/** Called when user clicks "Register" / "Sign Up" link */
	onRegisterClick?: () => void;
}

export const LoginForm = ({ onAuthenticated, onRegisterClick }: LoginFormProps) => {
	const login = useLogin({ callbacks: toastCallbacks });

	const [emailInput, setEmailInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');
	const [magicCodeInput, setMagicCodeInput] = useState('');

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

	// Notify parent on successful authentication
	useEffect(() => {
		if (login.step === 'authenticated') {
			onAuthenticated?.();
		}
	}, [login.step, onAuthenticated]);

	const handleSubmitEmail = async () => {
		await login.submitEmail(emailInput);
	};

	const handleSubmitPassword = async () => {
		await login.submitPassword(passwordInput);
	};

	const handleSubmitMagicCode = async () => {
		await login.submitMagicCode(magicCodeInput);
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

	return (
		<>
			{/* Email Step */}
			{isEmailStep && (
				<div className="flex flex-col gap-6 w-full">
					<FormLabel title="Email Address" required>
						<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
							<InputGroupAddon>
								<Mail className="size-5 text-neutral-medium" />
							</InputGroupAddon>
							<InputGroupInput
								type="email"
								placeholder="you@example.com"
								value={emailInput}
								onChange={(e) => setEmailInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleSubmitEmail()}
								className="text-neutral placeholder:text-neutral-medium"
							/>
						</InputGroup>
					</FormLabel>

					{login.errors.email && (
						<p className="body-2 text-red-500">{login.errors.email}</p>
					)}

					<Button
						theme="accent"
						variant="solid"
						size="lg"
						className="w-full"
						onClick={handleSubmitEmail}
						disabled={login.isLoading}
					>
						{login.isLoading ? 'Loading...' : 'Continue'}
					</Button>

					{onRegisterClick && (
						<div className="flex items-center justify-center gap-2">
							<p className="body-2 text-neutral-strong">
								Don&apos;t have an account?
							</p>
							<Button
								type="button"
								onClick={onRegisterClick}
								size="link"
								variant="link"
							>
								Register
							</Button>
						</div>
					)}
				</div>
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
						<Button
							theme="accent"
							variant="solid-weak"
							size="lg"
							className="w-full"
							disabled={login.isLoading}
						>
							<KeyRound className="size-5" />
							Continue with Passkey
						</Button>
					)}

					{login.loginOptions?.social_logins &&
						login.loginOptions.social_logins.length > 0 && (
							<>
								<div className="flex items-center justify-center gap-2">
									<div className="flex-1 h-px bg-neutral-weak" />
									<p className="body-2 text-neutral-strong">or continue with</p>
									<div className="flex-1 h-px bg-neutral-weak" />
								</div>

								<div className="flex flex-col gap-3">
									{login.loginOptions.social_logins.map((provider) => (
										<Button
											key={provider}
											theme="neutral"
											variant="outline"
											size="lg"
											className="w-full capitalize"
											onClick={() => {
												const url = login.getSocialAuthUrl(
													provider,
													window.location.origin + '/login'
												);
												window.location.href = url;
											}}
											disabled={login.isLoading}
										>
											Continue with {provider}
										</Button>
									))}
								</div>
							</>
						)}

					{login.errors.global && (
						<p className="body-2 text-red-500">{login.errors.global}</p>
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
						<p className="body-2 text-red-500">{login.errors.password}</p>
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
						<p className="body-2 text-red-500">{login.errors.global}</p>
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
								placeholder="Enter 6-digit code"
								value={magicCodeInput}
								onChange={(e) => setMagicCodeInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleSubmitMagicCode()}
								maxLength={6}
								className="text-neutral placeholder:text-neutral-medium"
							/>
						</InputGroup>
					</FormLabel>

					{login.errors.magicCode && (
						<p className="body-2 text-red-500">{login.errors.magicCode}</p>
					)}

					<p className="body-2 text-neutral-strong text-center">
						A 6-digit code has been sent to your email.
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
								? `Resend code in ${Math.ceil(magicCodeRemainingMs / 1000)}s`
								: 'Resend code'}
						</Button>
					</div>

					{login.errors.global && (
						<p className="body-2 text-red-500">{login.errors.global}</p>
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
									{login.errors.resetPassword}
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
						<p className="body-2 text-red-500">{login.errors.global}</p>
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
