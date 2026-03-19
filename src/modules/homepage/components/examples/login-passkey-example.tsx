'use client';

import { useLogin } from '@unidy.io/sdk-react';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput
} from '@/components/shadcn/ui/input-group';
import { mutationCallbackOptions } from '@/deps/unidy/callbacks';
import { translateAuthError } from '@/locales/translate-auth-error';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';

export const LoginPasskeyExample = () => {
	const login = useLogin({ callbacks: mutationCallbackOptions });
	const router = useRouter();
	const [emailInput, setEmailInput] = useState('');

	useEffect(() => {
		if (login.step === 'authenticated') {
			router.refresh();
		}
	}, [login.step, router]);

	const isEmailStep = login.step === 'idle' || login.step === 'email';
	const isVerificationStep = login.step === 'verification';

	const handleBack = () => {
		login.restart();
	};

	return (
		<div className="flex flex-col gap-6 w-full">
			{/* Email Step */}
			{isEmailStep && (
				<form
					className="contents"
					onSubmit={(e) => {
						e.preventDefault();
						login.submitEmail(emailInput);
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
								onChange={(e) => setEmailInput(e.target.value)}
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

					<SDKWrapper
						title="Auth SDK / Submit"
						codeSnippet={`import { useLogin } from '@unidy.io/sdk-react';\n\nconst login = useLogin();\nawait login.submitEmail(email);\n// login.loginOptions?.passkey → true`}
						size="sm"
						labelPosition="top-left"
						popoverPosition="left"
					>
						<Button
							theme="accent"
							variant="solid"
							size="lg"
							className="w-full"
							type="submit"
							disabled={login.isLoading || !emailInput.trim()}
						>
							{login.isLoading ? 'Loading...' : 'Continue'}
						</Button>
					</SDKWrapper>

					<div className="flex items-center justify-center gap-2">
						<div className="flex-1 h-px bg-neutral-weak" />
						<p className="body-2 text-neutral-strong">or</p>
						<div className="flex-1 h-px bg-neutral-weak" />
					</div>

					<SDKWrapper
						title="Auth SDK / Passkey"
						codeSnippet={`const login = useLogin();\nawait login.authenticateWithPasskey();\n// No email needed — uses discoverable credentials`}
						size="sm"
						popoverPosition="left"
					>
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
					</SDKWrapper>

					{login.errors.passkey && (
						<p className="body-2 text-red-500">
							{translateAuthError(login.errors.passkey)}
						</p>
					)}
				</form>
			)}

			{/* Verification Step - passkey option */}
			{isVerificationStep && (
				<>
					<FormLabel title="Email Address">
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

					<SDKWrapper
						title="Auth SDK / Passkey"
						codeSnippet={`const login = useLogin();\nawait login.authenticateWithPasskey();\n// Handles full WebAuthn flow`}
						size="sm"
						popoverPosition="left"
					>
						<Button
							theme="accent"
							variant="solid"
							size="lg"
							className="w-full"
							onClick={() => login.authenticateWithPasskey()}
							disabled={login.isLoading}
						>
							<KeyRound className="size-5" />
							{login.isLoading ? 'Authenticating...' : 'Continue with Passkey'}
						</Button>
					</SDKWrapper>

					{login.errors.passkey && (
						<p className="body-2 text-red-500">
							{translateAuthError(login.errors.passkey)}
						</p>
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
						onClick={handleBack}
					>
						<ArrowLeft className="size-4" />
						Back
					</Button>
				</>
			)}
		</div>
	);
};
