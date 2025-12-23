import { Button } from '@/components/shadcn/ui/button';
import {
	ButtonTabs,
	ButtonTabsContent,
	ButtonTabsGroup,
	ButtonTabsList,
	ButtonTabsTrigger
} from '@/components/shadcn/ui/button-tabs';
import { SDKElement } from '@/modules/sdk-element/components/sdk-element';
import { Lock, Mail } from 'lucide-react';

export const LoginSimpleExample = () => {
	return (
		<div className="flex flex-col gap-6 w-full">
			{/* Login/Register Toggle */}
			<ButtonTabs defaultValue="login">
				<ButtonTabsList>
					<ButtonTabsGroup className="w-full">
						<ButtonTabsTrigger value="login">Login</ButtonTabsTrigger>
						<ButtonTabsTrigger value="register">Register</ButtonTabsTrigger>
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
					/>
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
				</div>

				{/* Password Input */}
				<div className="flex flex-col gap-2 relative">
					<div className="flex flex-col gap-2">
						<label className="caption text-[#364153]">Password</label>
						<div className="border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4 relative">
							<SDKElement
								title="Auth SDK / Password Input"
								codeSnippet="<input type='password' />"
								size="sm"
							/>
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
					<Button theme="accent" variant="solid" size="lg" className="w-full">
						Sign In
					</Button>
				</div>
			</div>

			{/* Sign Up Link */}
			<div className="flex items-center justify-center gap-2">
				<p className="body-2 text-neutral-strong">Don't have an account?</p>
				<Button theme="accent" variant="ghost" className="h-8">
					Sign Up
				</Button>
			</div>
		</div>
	);
};
