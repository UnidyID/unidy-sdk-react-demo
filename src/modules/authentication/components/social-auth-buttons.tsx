'use client';

import { GoogleIcon } from '@/components/icons/google-icon';
import { Button } from '@/components/shadcn/ui/button';

export const visibleSocialProviders = (providers: string[]) =>
	providers.filter((provider) => provider === 'google');

const getProviderLabel = () => 'Google';
const getProviderIcon = () => <GoogleIcon className="size-5" />;

interface SocialAuthButtonsProps {
	providers: string[];
	onSelect: (provider: string) => void;
	disabled?: boolean;
}

export const SocialAuthButtons = ({
	providers,
	onSelect,
	disabled = false
}: SocialAuthButtonsProps) => {
	const filteredProviders = visibleSocialProviders(providers);

	if (filteredProviders.length === 0) return null;

	return (
		<div className="flex flex-col gap-3">
			{filteredProviders.map((provider) => (
			<Button
				key={provider}
				type="button"
				theme="neutral"
				variant="outline"
				size="lg"
				className="w-full"
				onClick={() => onSelect(provider)}
				disabled={disabled}
			>
				{getProviderIcon()}
				Continue with {getProviderLabel()}
			</Button>
			))}
		</div>
	);
};
