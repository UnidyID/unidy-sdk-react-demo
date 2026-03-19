'use client';

import { DialogClose, useDialog } from '@/components/shadcn/ui/dialog';
import { LoginForm } from '@/modules/authentication/components/login-form';
import { useCurrentReturnTo } from '@/modules/authentication/utils/return-to';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const LoginModalExample = () => {
	const { closeDialog } = useDialog();
	const router = useRouter();
	const returnTo = useCurrentReturnTo('/');

	return (
		<div className="flex flex-col md:flex-row md:h-[784px] overflow-hidden relative w-full">
			{/* Gradient Background Side */}
			<div className="min-h-[120px] md:h-full md:flex-1 md:shrink-0 relative flex flex-col items-center justify-center gap-6 px-10 py-12 bg-linear-[135deg,var(--color-accent-strong),var(--color-accent)_50%,var(--color-accent-strong)]">
				<p className="display-3 text-white text-center">Welcome Back</p>
				<div className="flex flex-col gap-3 items-center max-w-[280px]">
					<p className="body-1 text-white/80 text-center">
						Sign in to access your tickets, manage subscriptions, and update
						your profile.
					</p>
					<p className="body-3 text-white/50 text-center">
						Powered by the Unidy SDK — drop-in auth for any app.
					</p>
				</div>
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
					<LoginForm
						returnTo={returnTo}
						onAuthenticated={() => {
							closeDialog();
							router.refresh();
						}}
					/>
				</div>
			</div>
		</div>
	);
};
