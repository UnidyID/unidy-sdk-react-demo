'use client';

import { ArrowLeft, CheckCircle2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

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

type RegisterStep = 1 | 2 | 3 | 4;

export const LoginPage = () => {
	const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
	const [registerStep, setRegisterStep] = useState<RegisterStep>(1);

	// Form state
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [address, setAddress] = useState('');

	const handleContinue = () => {
		if (registerStep === 1) {
			setRegisterStep(2);
		} else if (registerStep === 2) {
			setRegisterStep(3);
		}
	};

	const handleBack = () => {
		if (registerStep === 2) {
			setRegisterStep(1);
		} else if (registerStep === 3) {
			setRegisterStep(2);
		}
	};

	const handleCreateAccount = () => {
		setRegisterStep(4);
	};

	const handleTabChange = (value: string) => {
		setActiveTab(value as 'login' | 'register');
		if (value === 'register') {
			setRegisterStep(1);
		}
	};

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
					<p className="title-2 text-center text-accent-weak">
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
							<div className="flex flex-col gap-6 w-full">
								{/* Email Input */}
								<FormLabel title="Email Address" required>
									<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
										<InputGroupAddon>
											<Mail className="size-5 text-neutral-medium" />
										</InputGroupAddon>
										<InputGroupInput
											type="email"
											placeholder="you@example.com"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="text-neutral placeholder:text-neutral-medium"
										/>
									</InputGroup>
								</FormLabel>

								{/* Password Input */}
								<FormLabel title="Password" required>
									<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
										<InputGroupAddon>
											<Lock className="size-5 text-neutral-medium" />
										</InputGroupAddon>
										<InputGroupInput
											type="password"
											placeholder="••••••••"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="text-neutral placeholder:text-neutral-medium"
										/>
									</InputGroup>
								</FormLabel>

								{/* Forgot Password Link */}
								<div className="flex justify-end">
									<Button type="button" size="link" variant="link">
										Forgot password?
									</Button>
								</div>

								{/* Sign In Button */}
								<Button
									theme="accent"
									variant="solid"
									size="lg"
									className="w-full"
								>
									Sign In
								</Button>

								{/* Register Link */}
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
						</ButtonTabsContent>

						{/* Register Content */}
						<ButtonTabsContent value="register" className="w-full mt-6">
							{registerStep === 1 && (
								<div className="flex flex-col gap-6 w-full">
									{/* Email Input */}
									<FormLabel title="Email Address" required>
										<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
											<InputGroupAddon>
												<Mail className="size-5 text-neutral-medium" />
											</InputGroupAddon>
											<InputGroupInput
												type="email"
												placeholder="you@example.com"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									{/* Continue Button */}
									<Button
										theme="accent"
										variant="solid"
										size="lg"
										className="w-full"
										onClick={handleContinue}
									>
										Continue
									</Button>

									{/* Login Link */}
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

							{registerStep === 2 && (
								<div className="flex flex-col gap-6 w-full">
									{/* Locked Email Input */}
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
												value={email}
												disabled
												className="text-neutral cursor-not-allowed"
											/>
										</InputGroup>
									</FormLabel>

									{/* Password Input */}
									<FormLabel title="Password" required>
										<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
											<InputGroupAddon>
												<Lock className="size-5 text-neutral-medium" />
											</InputGroupAddon>
											<InputGroupInput
												type="password"
												placeholder="••••••••"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									{/* Repeat Password Input */}
									<FormLabel title="Repeat Password" required>
										<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
											<InputGroupAddon>
												<Lock className="size-5 text-neutral-medium" />
											</InputGroupAddon>
											<InputGroupInput
												type="password"
												placeholder="••••••••"
												value={repeatPassword}
												onChange={(e) => setRepeatPassword(e.target.value)}
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									{/* Buttons */}
									<div className="flex gap-4 w-full">
										<Button
											theme="neutral"
											variant="outline"
											size="lg"
											className="flex-1"
											onClick={handleBack}
										>
											<ArrowLeft className="size-4" />
											Back
										</Button>
										<Button
											theme="accent"
											variant="solid"
											size="lg"
											className="flex-1"
											onClick={handleContinue}
										>
											Continue
										</Button>
									</div>

									{/* Login Link */}
									<div className="flex items-center justify-center gap-2">
										<p className="body-2 text-neutral-strong">
											Already have an account?
										</p>
										<Button
											theme="accent"
											variant="link"
											size="link"
											onClick={() => setActiveTab('login')}
										>
											Login
										</Button>
									</div>
								</div>
							)}

							{registerStep === 3 && (
								<div className="flex flex-col gap-6 w-full">
									{/* Locked Email Input */}
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
												value={email}
												disabled
												className="text-neutral cursor-not-allowed"
											/>
										</InputGroup>
									</FormLabel>

									{/* Locked Password Input */}
									<FormLabel title="Password" required>
										<InputGroup
											className="border-neutral-medium rounded-[10px] h-[50px] bg-neutral-weak"
											data-disabled="true"
										>
											<InputGroupAddon>
												<Lock className="size-5 text-neutral-medium" />
											</InputGroupAddon>
											<InputGroupInput
												type="password"
												value={password}
												disabled
												className="text-neutral cursor-not-allowed"
											/>
										</InputGroup>
									</FormLabel>

									{/* Full Name Input */}
									<FormLabel title="Full Name" required>
										<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
											<InputGroupInput
												type="text"
												placeholder="John Doe"
												value={fullName}
												onChange={(e) => setFullName(e.target.value)}
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									{/* Address Input */}
									<FormLabel title="Address" required>
										<InputGroup className="border-neutral-medium rounded-[10px] h-[50px]">
											<InputGroupInput
												type="text"
												placeholder="123 Main St, City, State"
												value={address}
												onChange={(e) => setAddress(e.target.value)}
												className="text-neutral placeholder:text-neutral-medium"
											/>
										</InputGroup>
									</FormLabel>

									{/* Buttons */}
									<div className="flex gap-4 w-full">
										<Button
											theme="neutral"
											variant="outline"
											size="lg"
											className="flex-1"
											onClick={handleBack}
										>
											<ArrowLeft className="size-4" />
											Back
										</Button>
										<Button
											theme="accent"
											variant="solid"
											size="lg"
											className="flex-1"
											onClick={handleCreateAccount}
										>
											Create Account
										</Button>
									</div>

									{/* Login Link */}
									<div className="flex items-center justify-center gap-2">
										<p className="body-2 text-neutral-strong">
											Already have an account?
										</p>
										<Button
											theme="accent"
											variant="link"
											size="link"
											onClick={() => setActiveTab('login')}
										>
											Login
										</Button>
									</div>
								</div>
							)}

							{registerStep === 4 && (
								<div className="flex flex-col gap-6 w-full">
									{/* Verification Message */}
									<div className="border border-neutral-medium rounded-[10px] p-4 flex gap-4 items-start bg-neutral-weak">
										<CheckCircle2 className="size-10 text-theme shrink-0" />
										<div className="flex flex-col gap-1">
											<p className="body-1 text-neutral-strong font-semibold">
												Verification email sent!
											</p>
											<p className="body-2 text-neutral-strong">
												Please check your inbox to continue.
											</p>
										</div>
									</div>

									{/* Login Link */}
									<div className="flex items-center justify-center gap-2">
										<p className="body-2 text-neutral-strong">
											Already have an account?
										</p>
										<Button
											theme="accent"
											variant="link"
											size="link"
											onClick={() => setActiveTab('login')}
										>
											Login
										</Button>
									</div>
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
