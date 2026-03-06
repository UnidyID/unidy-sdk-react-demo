'use client';

import {
	ButtonTabs,
	ButtonTabsContent,
	ButtonTabsGroup,
	ButtonTabsList,
	ButtonTabsTrigger
} from '@/components/shadcn/ui/button-tabs';
import { LoginForm } from '@/modules/authentication/components/login-form';

export const LoginSimpleExample = () => {
	return (
		<div className="flex flex-col gap-6 w-full">
			<ButtonTabs defaultValue="login">
				<ButtonTabsList>
					<ButtonTabsGroup className="w-full">
						<ButtonTabsTrigger value="login">Login</ButtonTabsTrigger>
						<ButtonTabsTrigger
							value="register"
							onClick={() => {
								window.location.href = '/login';
							}}
						>
							Register
						</ButtonTabsTrigger>
					</ButtonTabsGroup>
				</ButtonTabsList>
				<ButtonTabsContent value="login" />
				<ButtonTabsContent value="register" />
			</ButtonTabs>

			<LoginForm
				onRegisterClick={() => {
					window.location.href = '/login';
				}}
			/>
		</div>
	);
};
