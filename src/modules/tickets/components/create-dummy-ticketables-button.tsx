'use client';

import { useSession } from '@unidy.io/sdk-react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button, type ButtonProps } from '@/components/shadcn/ui/button';

type CreateDummyTicketablesButtonProps = Omit<ButtonProps, 'onClick'> & {
	onCreated?: () => void | Promise<void>;
};

export const CreateDummyTicketablesButton = ({
	onCreated,
	children = 'Create Dummy Tickets & Subs',
	disabled,
	...buttonProps
}: CreateDummyTicketablesButtonProps) => {
	const session = useSession();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleClick = async () => {
		if (isSubmitting || session.isLoading) {
			return;
		}

		const idToken = await session.getToken();

		if (!idToken) {
			toast.error('Please log in before creating dummy ticketables.');
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch('/api/unidy/dummy-ticketables', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id_token: idToken
				})
			});

			const data = (await response.json().catch(() => null)) as
				| {
						message?: string;
						created?: {
							tickets?: unknown[];
							subscriptions?: unknown[];
						};
				  }
				| null;

			const createdTicketCount = data?.created?.tickets?.length ?? 0;
			const createdSubscriptionCount =
				data?.created?.subscriptions?.length ?? 0;

			if (!response.ok) {
				if (createdTicketCount > 0 || createdSubscriptionCount > 0) {
					await onCreated?.();
				}

				throw new Error(
					data?.message || 'Failed to create dummy tickets and subscriptions.'
				);
			}

			await onCreated?.();

			toast.success(
				data?.message ||
					`Created ${createdTicketCount} tickets and ${createdSubscriptionCount} subscriptions.`
			);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: 'Failed to create dummy tickets and subscriptions.'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Button
			type="button"
			onClick={handleClick}
			disabled={disabled || isSubmitting || session.isLoading}
			{...buttonProps}
		>
			{isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
			{children}
		</Button>
	);
};
