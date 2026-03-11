'use client';

import { GoogleIcon } from '@/components/icons/google-icon';
import { Button } from '@/components/shadcn/ui/button';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';
import { useLogin } from '@unidy.io/sdk-react';

export const LoginSocialExample = () => {
	const login = useLogin();

	return (
		<div className="flex flex-col gap-6 w-full items-center py-6">
			<div className="flex flex-col gap-2 items-center text-center">
				<h3 className="title-2 text-neutral">Sign in with a provider</h3>
				<p className="body-2 text-neutral-strong">
					No email or password needed — authenticate directly with your social
					account.
				</p>
			</div>

			<SDKWrapper
				title="Auth SDK / Social Login"
				codeSnippet={`import { useLogin } from '@unidy.io/sdk-react';\n\nconst login = useLogin();\nconst url = login.getSocialAuthUrl('google', redirectUri);\nwindow.location.href = url;`}
				size="sm"
				popoverPosition="left"
				className="w-full"
			>
				<Button
					theme="neutral"
					variant="outline"
					size="lg"
					className="w-full"
					onClick={() => {
						const url = login.getSocialAuthUrl(
							'google',
							window.location.origin + '/login'
						);
						window.location.href = url;
					}}
				>
					<GoogleIcon className="size-5" />
					Continue with Google
				</Button>
			</SDKWrapper>
		</div>
	);
};
