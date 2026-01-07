import { Button } from '@/components/shadcn/ui/button';
import { SDKElement } from '@/modules/sdk-element/components/sdk-element';
import { KeyRound, Mail, Send } from 'lucide-react';

export const LoginExtrasExample = () => {
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

			{/* Continue and Magic Link Buttons */}
			<div className="flex gap-2 relative">
				<SDKElement
					title="Auth SDK / Submit"
					codeSnippet="<button type='submit'>Continue</button>"
					size="sm"
					labelPosition="top-left"
					popoverPosition="left"
				/>
				<Button theme="accent" variant="solid" size="lg" className="flex-1">
					Continue
				</Button>
				<Button
					theme="accent"
					variant="solid-weak"
					size="lg"
					className="flex-1"
				>
					<Send className="size-6" />
					Send Magic Link
				</Button>
			</div>

			{/* Divider */}
			<div className="flex items-center justify-center gap-2">
				<div className="flex-1 h-px bg-neutral-weak" />
				<p className="body-2 text-neutral-strong">or</p>
				<div className="flex-1 h-px bg-neutral-weak" />
			</div>

			{/* Passcode Button */}
			<div className="relative">
				<SDKElement
					title="Auth SDK / Passcode Button"
					codeSnippet="<PasscodeButton />"
					size="sm"
					labelPosition="top-right"
					popoverPosition="left"
				/>
				<Button
					theme="accent"
					variant="solid-weak"
					size="lg"
					className="w-full"
				>
					<KeyRound className="size-6" />
					Continue with Passcode
				</Button>
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
