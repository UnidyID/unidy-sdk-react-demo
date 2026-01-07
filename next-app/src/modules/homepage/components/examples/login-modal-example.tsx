'use client';

import { Button } from '@/components/shadcn/ui/button';
import {
	ButtonTabs,
	ButtonTabsContent,
	ButtonTabsGroup,
	ButtonTabsList,
	ButtonTabsTrigger
} from '@/components/shadcn/ui/button-tabs';
import { DialogClose } from '@/components/shadcn/ui/dialog';
import { SDKElement } from '@/modules/sdk-element/components/sdk-element';
import { Lock, Mail, X } from 'lucide-react';

export const LoginModalExample = () => {
	return (
		<div className="flex flex-col md:flex-row md:h-[784px] overflow-hidden relative w-full">
			{/* Gradient Background Side */}
			<div className="min-h-[120px] md:h-full md:flex-1 md:shrink-0 relative flex items-center justify-center bg-linear-[135deg,var(--color-accent-strong),var(--color-accent)_50%,var(--color-accent-strong)]">
				<p className="display-3 text-white text-center whitespace-nowrap">
					Login Modal Example
				</p>
			</div>

			{/* Content Side */}
			<div className="md:h-full flex-1 shrink-0 bg-section flex flex-col items-center justify-center p-10 relative">
				{/* Close Button */}
				<DialogClose
					className="absolute right-5 top-5 rounded-[12px] size-[52px] flex items-center justify-center hover:bg-neutral-weak transition-colors bg-transparent not-md:hidden"
					aria-label="Close"
				>
					<X className="size-6 text-neutral" />
				</DialogClose>

				{/* Form Content */}
				<div className="flex flex-col gap-6 w-full">
					{/* Login/Register Toggle */}
					<ButtonTabs defaultValue="login">
						<ButtonTabsList>
							<ButtonTabsGroup className="w-full h-12 p-1">
								<ButtonTabsTrigger value="login" className="h-10 flex-1">
									Login
								</ButtonTabsTrigger>
								<ButtonTabsTrigger value="register" className="h-10 flex-1">
									Register
								</ButtonTabsTrigger>
							</ButtonTabsGroup>
						</ButtonTabsList>
						<ButtonTabsContent value="login"></ButtonTabsContent>
						<ButtonTabsContent value="register"></ButtonTabsContent>
					</ButtonTabs>

					{/* Form */}
					<div className="flex flex-col gap-4 w-full">
						{/* Email Input */}
						<div className="flex flex-col gap-2 relative">
							<SDKElement
								title="Auth SDK / Email Input"
								codeSnippet="<input type='email' />"
								size="sm"
								labelPosition="top-right"
							/>
							<div className="flex flex-col gap-2">
								<label className="caption text-[#364153] h-5">
									Email Address
								</label>
								<div className="border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4">
									<Mail className="size-5 text-neutral-medium shrink-0" />
									<input
										type="email"
										placeholder="you@example.com"
										className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
									/>
								</div>
							</div>
						</div>

						{/* Password Input */}
						<div className="flex flex-col gap-2 relative">
							<SDKElement
								title="Auth SDK / Password Input"
								codeSnippet="<input type='password' />"
								size="sm"
								labelPosition="top-right"
							/>
							<div className="flex flex-col gap-2">
								<label className="caption text-[#364153] h-5">Password</label>
								<div className="border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4 relative">
									<Lock className="size-5 text-neutral-medium shrink-0" />
									<input
										type="password"
										placeholder="••••••••"
										className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
									/>
								</div>
							</div>
						</div>

						{/* Forgot Password */}
						<div className="flex items-center justify-end">
							<Button theme="accent" variant="link" size="link">
								Forgot password?
							</Button>
						</div>

						{/* Submit Button */}
						<div className="relative">
							<SDKElement
								title="Auth SDK / Submit"
								codeSnippet="<button type='submit'>Sign In</button>"
								size="sm"
								labelPosition="top-left"
							/>
							<Button
								theme="accent"
								variant="solid"
								size="lg"
								className="w-full"
							>
								Sign In
							</Button>
						</div>
					</div>

					{/* Sign Up Link */}
					<div className="flex items-center justify-center gap-1 px-[43px]">
						<p className="body-2 text-neutral-strong whitespace-nowrap">
							Don't have an account?
						</p>
						<Button theme="accent" variant="ghost" className="h-8 px-4">
							Sign Up
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
