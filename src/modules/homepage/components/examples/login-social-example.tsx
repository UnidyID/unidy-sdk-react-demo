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
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

export const LoginSocialExample = () => {
	const login = useLogin({ callbacks: toastCallbacks });
	const [emailInput, setEmailInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');

	const isEmailStep = login.step === 'idle' || login.step === 'email';
	const isVerificationStep = login.step === 'verification';
	const isPasswordStep = login.step === 'password';

	const handleBack = () => {
		login.restart();
		setPasswordInput('');
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
							onClick={() => login.submitEmail(emailInput)}
							disabled={login.isLoading}
						>
							{login.isLoading ? 'Loading...' : 'Continue'}
						</Button>
					</SDKWrapper>
				</>
			)}

			{/* Verification Step - show social providers */}
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

					{/* Password fallback if no social providers */}
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

					{/* Social login options */}
					{login.loginOptions?.social_logins && login.loginOptions.social_logins.length > 0 && (
						<>
							<div className="flex items-center justify-center gap-2">
								<div className="flex-1 h-px bg-neutral-weak" />
								<p className="body-2 text-neutral-strong">or continue with providers</p>
								<div className="flex-1 h-px bg-neutral-weak" />
							</div>

							<div className="flex flex-col gap-3 w-full">
								{login.loginOptions.social_logins.map((provider) => (
									<SDKWrapper
										key={provider}
										title="Auth SDK / OAuth2 Button"
										codeSnippet={`const login = useLogin();\nconst url = login.getSocialAuthUrl('${provider}', redirectUri);\nwindow.location.href = url;`}
										size="sm"
										labelPosition="top-right"
										popoverPosition="left"
									>
										<Button
											theme="neutral"
											variant="outline"
											size="lg"
											className="w-full capitalize"
											onClick={() => {
												const url = login.getSocialAuthUrl(provider, window.location.origin + '/login');
												window.location.href = url;
											}}
											disabled={login.isLoading}
										>
											Continue with {provider}
										</Button>
									</SDKWrapper>
								))}
							</div>
						</>
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

			{/* Password Step (fallback when social not available) */}
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

			{/* Terms footer - only on email step */}
			{isEmailStep && (
				<div className="flex items-center justify-center gap-2 px-[37px]">
					<p className="body-2 text-neutral-strong">
						By creating an account you accept
					</p>
					<Button theme="accent" variant="ghost" className="h-8">
						Terms & Conditions
					</Button>
				</div>
			)}
		</div>
	);
};
