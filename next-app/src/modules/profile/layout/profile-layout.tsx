import { Button } from '@/components/shadcn/ui/button';
import { type FC, type PropsWithChildren } from 'react';
import { ProfileNavigation } from '../components/profile-navigation';
import { ProfileSidebar } from '../components/profile-sidebar';

export const ProfileLayout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="bg-background min-h-screen flex flex-col">
			<ProfileNavigation>
				<Button theme="neutral" variant="solid" size="md">
					Log out
				</Button>
			</ProfileNavigation>

			<div className="flex-1 flex justify-center py-6 lg:py-10">
				<div className="max-w-[1200px] w-full px-2 lg:px-6 flex flex-col md:flex-row gap-6 lg:gap-10">
					<ProfileSidebar />

					{children}
				</div>
			</div>
		</div>
	);
};
