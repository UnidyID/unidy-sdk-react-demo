import { Button } from '@/components/shadcn/ui/button';
import { SDKElement } from '@/modules/sdk-element/components/sdk-element';
import { Apple, Facebook, Mail, Twitter } from 'lucide-react';

export const LoginSocialExample = () => {
	return (
		<div className="flex flex-col gap-6 w-full">
			{/* Email Input */}
			<div className="flex flex-col gap-2">
				<label className="caption text-[#364153]">Email Address</label>
				<div className="border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4">
					<Mail className="size-5 text-neutral-medium shrink-0" />
					<input
						type="email"
						placeholder="you@example.com"
						className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
					/>
				</div>
			</div>

			{/* Continue Button */}
			<div className="relative">
				<SDKElement
					title="Auth SDK / Submit"
					codeSnippet="<button type='submit'>Continue</button>"
					size="sm"
					labelPosition="top-left"
				/>
				<Button theme="accent" variant="solid" size="lg" className="w-full">
					Continue
				</Button>
			</div>

			{/* Divider */}
			<div className="flex items-center justify-center gap-2">
				<div className="flex-1 h-px bg-neutral-weak" />
				<p className="body-2 text-neutral-strong">or continue with providers</p>
				<div className="flex-1 h-px bg-neutral-weak" />
			</div>

			{/* Social Buttons */}
			<div className="flex flex-col gap-3 w-full">
				{/* Google Button */}
				<div className="relative">
					<SDKElement
						title="Auth SDK / OAuth2 Button"
						codeSnippet="<OAuthButton provider='google' />"
						size="sm"
						labelPosition="top-right"
					/>
					<Button
						theme="neutral"
						variant="outline"
						size="lg"
						className="w-full"
					>
						<svg
							className="size-6"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						Continue with Google
					</Button>
				</div>

				{/* Apple Button */}
				<Button theme="neutral" variant="outline" size="lg" className="w-full">
					<Apple className="size-6" />
					Continue with Apple
				</Button>

				{/* Facebook and Twitter Buttons */}
				<div className="flex gap-2.5">
					<Button
						theme="neutral"
						variant="outline"
						size="lg"
						className="flex-1"
					>
						<Facebook className="size-6" />
					</Button>
					<Button
						theme="neutral"
						variant="outline"
						size="lg"
						className="w-[187px]"
					>
						<Twitter className="size-6" />
					</Button>
				</div>
			</div>

			{/* Terms & Conditions */}
			<div className="flex items-center justify-center gap-2 px-[37px]">
				<p className="body-2 text-neutral-strong">
					By creating an account you accept
				</p>
				<Button theme="accent" variant="ghost" className="h-8">
					Terms & Conditions
				</Button>
			</div>
		</div>
	);
};
