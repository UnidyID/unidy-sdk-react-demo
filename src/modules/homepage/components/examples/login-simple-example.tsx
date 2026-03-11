'use client';

import { useLogin } from '@unidy.io/sdk-react';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
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

export const LoginSimpleExample = () => {
	const login = useLogin({ callbacks: mutationCallbackOptions });
	const router = useRouter();
	const [emailInput, setEmailInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');

	useEffect(() => {
		if (login.step === 'authenticated') {
			router.refresh();
		}
	}, [login.step, router]);

	// Auto-advance to password step once verification options arrive
	useEffect(() => {
		if (login.step === 'verification' && login.loginOptions?.password) {
			login.goToStep('password');
		}
	}, [login.step, login.loginOptions?.password]);

	const isEmailStep = login.step === 'idle' || login.step === 'email';
	const isPasswordStep = login.step === 'password';

	const handleBack = () => {
		login.restart();
		setPasswordInput('');
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
						codeSnippet={`import { useLogin } from '@unidy.io/sdk-react';\n\nconst login = useLogin();\nawait login.submitEmail(email);`}
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
				</form>
			)}

			{/* Password Step */}
			{isPasswordStep && (
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
								onKeyDown={(e) =>
									e.key === 'Enter' && login.submitPassword(passwordInput)
								}
								className="text-neutral placeholder:text-neutral-medium"
							/>
						</InputGroup>
					</FormLabel>

					{login.errors.password && (
						<p className="body-2 text-red-500">
							{translateAuthError(login.errors.password)}
						</p>
					)}

					<SDKWrapper
						title="Auth SDK / Password"
						codeSnippet={`const login = useLogin();\nawait login.submitPassword(password);`}
						size="sm"
						popoverPosition="left"
					>
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
					</SDKWrapper>

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
