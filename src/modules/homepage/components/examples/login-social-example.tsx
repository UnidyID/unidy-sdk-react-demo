'use client';

import {
	buildAbsoluteLoginHref,
	useCurrentReturnTo
} from '@/modules/authentication/utils/return-to';
import { SocialAuthButtons } from '@/modules/authentication/components/social-auth-buttons';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';
import { useLogin } from '@unidy.io/sdk-react';

export const LoginSocialExample = () => {
	const login = useLogin();
	const returnTo = useCurrentReturnTo('/');

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
				<SocialAuthButtons
					providers={['google']}
					onSelect={(provider) => {
						const url = login.getSocialAuthUrl(
							provider,
							buildAbsoluteLoginHref(window.location.origin, returnTo, '/')
						);
						window.location.href = url;
					}}
				/>
			</SDKWrapper>
		</div>
	);
};
