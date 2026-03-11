'use client';

import { LoginForm } from '@/modules/authentication/components/login-form';
import { useRouter } from 'next/navigation';

export const LoginKitchenSinkExample = () => {
	const router = useRouter();

	return (
		<div className="flex flex-col gap-6 w-full">
			<LoginForm
				onAuthenticated={() => {
					router.refresh();
				}}
			/>
		</div>
	);
};
