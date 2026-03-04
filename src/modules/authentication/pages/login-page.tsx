'use client';

import { ArrowLeft, CheckCircle2, KeyRound, Lock, Mail, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useLogin } from '@unidy.io/sdk-react';
import { toastCallbacks } from '@/deps/unidy/callbacks';

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

export const LoginPage = () => {
	const router = useRouter();
	const login = useLogin({ callbacks: toastCallbacks });

	const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
	const [emailInput, setEmailInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');
	const [magicCodeInput, setMagicCodeInput] = useState('');

	// Redirect to profile on successful authentication
	useEffect(() => {
		if (login.step === 'authenticated') {
			router.push('/profile');
		}
	}, [login.step, router]);

	const handleTabChange = (value: string) => {
		setActiveTab(value as 'login' | 'register');
		if (login.step !== 'idle' && login.step !== 'email') {
			login.restart();
		}
	};

	const handleSubmitEmail = async () => {
		await login.submitEmail(emailInput);
	};

	const handleSubmitPassword = async () => {
		await login.submitPassword(passwordInput);
	};

	const handleSubmitMagicCode = async () => {
		await login.submitMagicCode(magicCodeInput);
	};

	const handleForgotPassword = () => {
		login.goToStep('reset-password');
	};

	const handleSendResetEmail = async () => {
		await login.sendResetPasswordEmail();
	};

	const handleGoBack = () => {
		login.goBack();
		setPasswordInput('');
		setMagicCodeInput('');
	};

	// Determine which step content to render
	const isEmailStep = login.step === 'idle' || login.step === 'email';
	const isVerificationStep = login.step === 'verification';
	const isPasswordStep = login.step === 'password';
	const isMagicCodeStep = login.step === 'magic-code';
	const isResetPasswordStep = login.step === 'reset-password';

	return (
		<div
			className="flex flex-col items-center justify-center min-h-screen px-2 md:px-6 py-8"
			style={{
				backgroundImage:
					'linear-gradient(150.64deg, rgba(216, 106, 96, 1) 0%, rgba(199, 42, 28, 1) 50%, rgba(216, 106, 96, 1) 100%)'
			}}
		>
			<div className="flex flex-col items-center gap-8 w-full max-w-[448px]">
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
								<ButtonTabsTrigger value="register" className="flex-1">
									Register
								</ButtonTabsTrigger>
							</ButtonTabsGroup>
						</ButtonTabsList>

						{/* Login Content */}
						<ButtonTabsContent value="login" className="w-full mt-6">
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
												onKeyDown={(e) =>
													e.key === 'Enter' && handleSubmitEmail()
												}
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									{login.errors.email && (
										<p className="body-2 text-red-500">
											{login.errors.email}
										</p>
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

									<div className="flex items-center justify-center gap-2">
										<p className="body-2 text-neutral-strong">
											Don&apos;t have an account?
										</p>
										<Button
											type="button"
											onClick={() => setActiveTab('register')}
											size="link"
											variant="link"
										>
											Register
										</Button>
									</div>
								</div>
							)}

							{/* Verification Step - show available login methods */}
							{isVerificationStep && (
								<div className="flex flex-col gap-3 w-full">
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
												value={login.email}
												disabled
												className="text-neutral cursor-not-allowed"
											/>
										</InputGroup>
									</FormLabel>

									{/* Password option */}
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

									{/* Magic code option */}
									{login.loginOptions?.magic_link && (
										<Button
											theme="accent"
											variant="solid-weak"
											size="md"
											className="w-full"
											onClick={() => {
												login.sendMagicCode();
											}}
											disabled={login.isLoading}
										>
											<Send className="size-5" />
											Send Magic Code
										</Button>
									)}

									{/* Passkey option */}
									{login.loginOptions?.passkey && (
										<Button
											theme="accent"
											variant="solid-weak"
											size="md"
											className="w-full"
											disabled={login.isLoading}
										>
											<KeyRound className="size-5" />
											Continue with Passkey
										</Button>
									)}

									{/* Social login options */}
									{login.loginOptions?.social_logins &&
										login.loginOptions.social_logins.length > 0 && (
											<>
												<div className="flex items-center justify-center gap-2">
													<div className="flex-1 h-px bg-neutral-weak" />
													<p className="body-2 text-neutral-strong">
														or continue with
													</p>
													<div className="flex-1 h-px bg-neutral-weak" />
												</div>

												<div className="flex flex-col gap-3">
													{login.loginOptions.social_logins.map(
														(provider) => (
															<Button
																key={provider}
																theme="neutral"
																variant="outline"
																size="md"
																className="w-full capitalize"
																onClick={() => {
																	const url =
																		login.getSocialAuthUrl(
																			provider,
																			window.location.origin +
																				'/login'
																		);
																	window.location.href = url;
																}}
																disabled={login.isLoading}
															>
																Continue with {provider}
															</Button>
														)
													)}
												</div>
											</>
										)}

									{login.errors.global && (
										<p className="body-2 text-red-500">
											{login.errors.global}
										</p>
									)}

									{/* Back button */}
									{login.canGoBack && (
										<div className="flex justify-center">
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
								</div>
							)}

							{/* Password Step */}
							{isPasswordStep && (
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
												onKeyDown={(e) =>
													e.key === 'Enter' && handleSubmitPassword()
												}
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									{login.errors.password && (
										<p className="body-2 text-red-500">
											{login.errors.password}
										</p>
									)}

									{/* Forgot Password Link */}
									<div className="flex justify-end">
										<Button
											type="button"
											size="link"
											variant="link"
											onClick={handleForgotPassword}
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
											{login.errors.global}
										</p>
									)}

									{/* Back button */}
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
												onChange={(e) =>
													setMagicCodeInput(e.target.value)
												}
												onKeyDown={(e) =>
													e.key === 'Enter' && handleSubmitMagicCode()
												}
												maxLength={6}
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									{login.errors.magicCode && (
										<p className="body-2 text-red-500">
											{login.errors.magicCode}
										</p>
									)}

									<p className="body-2 text-neutral-strong text-center">
										A 6-digit code has been sent to your email.
									</p>

									<Button
										theme="accent"
										variant="solid"
										size="md"
										className="w-full"
										onClick={handleSubmitMagicCode}
										disabled={login.isLoading}
									>
										{login.isLoading ? 'Verifying...' : 'Verify Code'}
									</Button>

									{/* Resend code */}
									<div className="flex justify-center">
										<Button
											type="button"
											size="link"
											variant="link"
											onClick={() => login.sendMagicCode()}
											disabled={
												login.isLoading ||
												(login.magicCodeResendAfter !== null &&
													login.magicCodeResendAfter > 0)
											}
										>
											{login.magicCodeResendAfter !== null &&
											login.magicCodeResendAfter > 0
												? `Resend code in ${login.magicCodeResendAfter}s`
												: 'Resend code'}
										</Button>
									</div>

									{login.errors.global && (
										<p className="body-2 text-red-500">
											{login.errors.global}
										</p>
									)}

									{/* Back button */}
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
												<h2 className="title-1 text-neutral">
													Reset Password
												</h2>
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
												onClick={handleSendResetEmail}
												disabled={login.isLoading}
											>
												{login.isLoading
													? 'Sending...'
													: 'Send Reset Email'}
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
													Please check your inbox for the password
													reset link.
												</p>
											</div>
										</div>
									)}

									{login.errors.global && (
										<p className="body-2 text-red-500">
											{login.errors.global}
										</p>
									)}

									{/* Back button */}
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
						</ButtonTabsContent>

						{/* Register Content — uses the same flow as login, SDK determines if new user */}
						<ButtonTabsContent value="register" className="w-full mt-6">
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
												onKeyDown={(e) =>
													e.key === 'Enter' && handleSubmitEmail()
												}
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									{login.errors.email && (
										<p className="body-2 text-red-500">
											{login.errors.email}
										</p>
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

							{/* Verification Step */}
							{isVerificationStep && (
								<div className="flex flex-col gap-3 w-full">
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
												value={login.email}
												disabled
												className="text-neutral cursor-not-allowed"
											/>
										</InputGroup>
									</FormLabel>

									{/* Password option */}
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

									{/* Magic code option */}
									{login.loginOptions?.magic_link && (
										<Button
											theme="accent"
											variant="solid-weak"
											size="md"
											className="w-full"
											onClick={() => {
												login.sendMagicCode();
											}}
											disabled={login.isLoading}
										>
											<Send className="size-5" />
											Send Magic Code
										</Button>
									)}

									{/* Passkey option */}
									{login.loginOptions?.passkey && (
										<Button
											theme="accent"
											variant="solid-weak"
											size="md"
											className="w-full"
											disabled={login.isLoading}
										>
											<KeyRound className="size-5" />
											Continue with Passkey
										</Button>
									)}

									{/* Social login options */}
									{login.loginOptions?.social_logins &&
										login.loginOptions.social_logins.length > 0 && (
											<>
												<div className="flex items-center justify-center gap-2">
													<div className="flex-1 h-px bg-neutral-weak" />
													<p className="body-2 text-neutral-strong">
														or continue with
													</p>
													<div className="flex-1 h-px bg-neutral-weak" />
												</div>

												<div className="flex flex-col gap-3">
													{login.loginOptions.social_logins.map(
														(provider) => (
															<Button
																key={provider}
																theme="neutral"
																variant="outline"
																size="md"
																className="w-full capitalize"
																onClick={() => {
																	const url =
																		login.getSocialAuthUrl(
																			provider,
																			window.location.origin +
																				'/login'
																		);
																	window.location.href = url;
																}}
																disabled={login.isLoading}
															>
																Continue with {provider}
															</Button>
														)
													)}
												</div>
											</>
										)}

									{login.errors.global && (
										<p className="body-2 text-red-500">
											{login.errors.global}
										</p>
									)}

									{/* Back button */}
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

							{/* Password Step */}
							{isPasswordStep && (
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
												onKeyDown={(e) =>
													e.key === 'Enter' && handleSubmitPassword()
												}
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									{login.errors.password && (
										<p className="body-2 text-red-500">
											{login.errors.password}
										</p>
									)}

									<Button
										theme="accent"
										variant="solid"
										size="lg"
										className="w-full"
										onClick={handleSubmitPassword}
										disabled={login.isLoading}
									>
										{login.isLoading ? 'Creating account...' : 'Continue'}
									</Button>

									{login.errors.global && (
										<p className="body-2 text-red-500">
											{login.errors.global}
										</p>
									)}

									{/* Back button */}
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
												onChange={(e) =>
													setMagicCodeInput(e.target.value)
												}
												onKeyDown={(e) =>
													e.key === 'Enter' && handleSubmitMagicCode()
												}
												maxLength={6}
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									{login.errors.magicCode && (
										<p className="body-2 text-red-500">
											{login.errors.magicCode}
										</p>
									)}

									<p className="body-2 text-neutral-strong text-center">
										A 6-digit code has been sent to your email.
									</p>

									<Button
										theme="accent"
										variant="solid"
										size="md"
										className="w-full"
										onClick={handleSubmitMagicCode}
										disabled={login.isLoading}
									>
										{login.isLoading ? 'Verifying...' : 'Verify Code'}
									</Button>

									{/* Resend code */}
									<div className="flex justify-center">
										<Button
											type="button"
											size="link"
											variant="link"
											onClick={() => login.sendMagicCode()}
											disabled={
												login.isLoading ||
												(login.magicCodeResendAfter !== null &&
													login.magicCodeResendAfter > 0)
											}
										>
											{login.magicCodeResendAfter !== null &&
											login.magicCodeResendAfter > 0
												? `Resend code in ${login.magicCodeResendAfter}s`
												: 'Resend code'}
										</Button>
									</div>

									{login.errors.global && (
										<p className="body-2 text-red-500">
											{login.errors.global}
										</p>
									)}

									{/* Back button */}
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
												<h2 className="title-1 text-neutral">
													Reset Password
												</h2>
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
												onClick={handleSendResetEmail}
												disabled={login.isLoading}
											>
												{login.isLoading
													? 'Sending...'
													: 'Send Reset Email'}
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
													Please check your inbox for the password
													reset link.
												</p>
											</div>
										</div>
									)}

									{login.errors.global && (
										<p className="body-2 text-red-500">
											{login.errors.global}
										</p>
									)}

									{/* Back button */}
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
