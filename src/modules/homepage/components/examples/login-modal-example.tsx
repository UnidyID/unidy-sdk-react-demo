'use client';

import { DialogClose, useDialog } from '@/components/shadcn/ui/dialog';
import { LoginForm } from '@/modules/authentication/components/login-form';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export const LoginModalExample = () => {
	const { closeDialog } = useDialog();
	const router = useRouter();

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
					<LoginForm
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
