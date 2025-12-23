'use client';

import { type FC } from 'react';
import { ConnectedAccounts } from '../components/connected-accounts';
import { ProfileDetailsForm } from '../components/profile-details-form';

export const ProfileDetailsPage: FC = () => {
	return (
		<div className="flex flex-col gap-6 grow">
			<ProfileDetailsForm
				initialData={{
					firstName: 'Matija',
					lastName: 'Fucek',
					email: 'matija.fucek@unidy.de',
					phone: '',
					streetAddress: '',
					city: '',
					country: '',
					dateOfBirth: ''
				}}
				onSubmit={(data) => {
					console.log('Profile updated:', data);
				}}
			/>
			<ConnectedAccounts />
		</div>
	);
};
