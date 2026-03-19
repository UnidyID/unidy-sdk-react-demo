'use client';

import { LoginForm } from '@/modules/authentication/components/login-form';
import { useCurrentReturnTo } from '@/modules/authentication/utils/return-to';
import { useRouter } from 'next/navigation';

export const LoginKitchenSinkExample = () => {
	const router = useRouter();
	const returnTo = useCurrentReturnTo('/');

	return (
		<div className="flex flex-col gap-6 w-full">
			<LoginForm
				returnTo={returnTo}
				onAuthenticated={() => {
					router.refresh();
				}}
			/>
		</div>
	);
};
