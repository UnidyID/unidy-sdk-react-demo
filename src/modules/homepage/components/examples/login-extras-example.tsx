'use client';

import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from '@/components/shadcn/ui/input-group';
import { toastCallbacks } from '@/deps/unidy/callbacks';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';
import { useLogin } from '@unidy.io/sdk-react';
import { ArrowLeft, KeyRound, Lock, Mail, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export const LoginExtrasExample = () => {
	const login = useLogin({ callbacks: toastCallbacks });
	const [emailInput, setEmailInput] = useState('');
	const [magicCodeInput, setMagicCodeInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');

	const isEmailStep = login.step === 'idle' || login.step === 'email';
	const isVerificationStep = login.step === 'verification';
	const isMagicCodeStep = login.step === 'magic-code';
	const isPasswordStep = login.step === 'password';

	// Magic code resend timer
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

	const handleBack = () => {
		login.restart();
		setPasswordInput('');
		setMagicCodeInput('');
	};

	return (
		<div className="flex flex-col gap-6 w-full">
			{/* Email Step */}
			{isEmailStep && (
				<>
					<div className="flex flex-col gap-2">
						<FormLabel title="Email Address">
							<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
								<InputGroupAddon>
									<Mail className="size-5 text-neutral-medium" />
								</InputGroupAddon>
								<InputGroupInput
									type="email"
									placeholder="you@example.com"
									value={emailInput}
									onChange={(e) => setEmailInput(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && login.submitEmail(emailInput)}
									className="text-neutral placeholder:text-neutral-medium"
								/>
							</InputGroup>
						</FormLabel>
					</div>

					{login.errors.email && (
						<p className="body-2 text-red-500">{login.errors.email}</p>
					)}

					<SDKWrapper
						title="Auth SDK / Submit"
						codeSnippet={`import { useLogin } from '@unidy.io/sdk-react';\n\nconst login = useLogin();\nawait login.submitEmail(email);\nawait login.sendMagicCode();`}
						size="sm"
						labelPosition="top-left"
						popoverPosition="left"
						className="flex gap-2 relative"
					>
						<Button
							theme="accent"
							variant="solid"
							size="lg"
							className="flex-1"
							onClick={() => login.submitEmail(emailInput)}
							disabled={login.isLoading}
						>
							{login.isLoading ? 'Loading...' : 'Continue'}
						</Button>
					</SDKWrapper>

					<div className="flex items-center justify-center gap-2 px-[37px]">
						<p className="body-2 text-neutral-strong">
							By creating an account you accept
						</p>
						<Button theme="accent" variant="ghost" className="h-8">
							Terms & Conditions
						</Button>
					</div>
				</>
			)}

			{/* Verification Step - show magic code / passkey / password options */}
			{isVerificationStep && (
				<>
					<FormLabel title="Email Address">
						<InputGroup className="border-neutral-medium rounded-[10px] h-[50px] bg-neutral-weak" data-disabled="true">
							<InputGroupAddon>
								<Mail className="size-5 text-neutral-medium" />
							</InputGroupAddon>
							<InputGroupInput type="email" value={login.email} disabled className="text-neutral cursor-not-allowed" />
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
						<SDKWrapper
							title="Auth SDK / Magic Code"
							codeSnippet={`const login = useLogin();\nawait login.sendMagicCode();`}
							size="sm"
							popoverPosition="left"
						>
							<Button
								theme="accent"
								variant="solid-weak"
								size="lg"
								className="w-full"
								onClick={() => login.sendMagicCode()}
								disabled={login.isLoading}
							>
								<Send className="size-6" />
								Send Magic Code
							</Button>
						</SDKWrapper>
					)}

					{login.loginOptions?.passkey && (
						<SDKWrapper
							title="Auth SDK / Passcode Button"
							codeSnippet={`const login = useLogin();\n// login.loginOptions?.passkey\n// Passkey authentication via WebAuthn`}
							size="sm"
							labelPosition="top-right"
							popoverPosition="left"
						>
							<Button
								theme="accent"
								variant="solid-weak"
								size="lg"
								className="w-full"
								disabled={login.isLoading}
							>
								<KeyRound className="size-6" />
								Continue with Passkey
							</Button>
						</SDKWrapper>
					)}

					{login.errors.global && (
						<p className="body-2 text-red-500">{login.errors.global}</p>
					)}

					<Button theme="neutral" variant="outline" size="md" className="w-full" onClick={handleBack}>
						<ArrowLeft className="size-4" />
						Back
					</Button>
				</>
			)}

			{/* Magic Code Step */}
			{isMagicCodeStep && (
				<>
					<FormLabel title="Email Address">
						<InputGroup className="border-neutral-medium rounded-[10px] h-[50px] bg-neutral-weak" data-disabled="true">
							<InputGroupAddon>
								<Mail className="size-5 text-neutral-medium" />
							</InputGroupAddon>
							<InputGroupInput type="email" value={login.email} disabled className="text-neutral cursor-not-allowed" />
						</InputGroup>
					</FormLabel>

					<FormLabel title="Magic Code">
						<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
							<InputGroupAddon>
								<KeyRound className="size-5 text-neutral-medium" />
							</InputGroupAddon>
							<InputGroupInput
								type="text"
								placeholder="Enter 6-digit code"
								value={magicCodeInput}
								onChange={(e) => setMagicCodeInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && login.submitMagicCode(magicCodeInput)}
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
						onClick={() => login.submitMagicCode(magicCodeInput)}
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
							disabled={login.isLoading || Math.ceil(magicCodeRemainingMs / 1000) > 0}
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
						<Button theme="neutral" variant="outline" size="md" className="w-full" onClick={handleBack}>
							<ArrowLeft className="size-4" />
							Back
						</Button>
					)}
				</>
			)}

			{/* Password Step (fallback) */}
			{isPasswordStep && (
				<>
					<FormLabel title="Email Address">
						<InputGroup className="border-neutral-medium rounded-[10px] h-[50px] bg-neutral-weak" data-disabled="true">
							<InputGroupAddon>
								<Mail className="size-5 text-neutral-medium" />
							</InputGroupAddon>
							<InputGroupInput type="email" value={login.email} disabled className="text-neutral cursor-not-allowed" />
						</InputGroup>
					</FormLabel>

					<FormLabel title="Password">
						<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
							<InputGroupAddon>
								<Lock className="size-5 text-neutral-medium" />
							</InputGroupAddon>
							<InputGroupInput
								type="password"
								placeholder="••••••••"
								value={passwordInput}
								onChange={(e) => setPasswordInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && login.submitPassword(passwordInput)}
								className="text-neutral placeholder:text-neutral-medium"
							/>
						</InputGroup>
					</FormLabel>

					{login.errors.password && (
						<p className="body-2 text-red-500">{login.errors.password}</p>
					)}

					<Button
						theme="accent"
						variant="solid"
						size="lg"
						className="w-full"
						onClick={() => login.submitPassword(passwordInput)}
						disabled={login.isLoading}
					>
						{login.isLoading ? 'Signing in...' : 'Sign In'}
					</Button>

					{login.errors.global && (
						<p className="body-2 text-red-500">{login.errors.global}</p>
					)}

					{login.canGoBack && (
						<Button theme="neutral" variant="outline" size="md" className="w-full" onClick={handleBack}>
							<ArrowLeft className="size-4" />
							Back
						</Button>
					)}
				</>
			)}
		</div>
	);
};
