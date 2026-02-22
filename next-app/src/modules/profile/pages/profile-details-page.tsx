'use client';

import { type FC } from 'react';
import { useProfile } from '@unidy.io/sdk-react';
import { toastCallbacks } from '@/lib/unidy/callbacks';
import { ConnectedAccounts } from '../components/connected-accounts';
import {
	ProfileDetailsForm,
	type ProfileDetailsFormData
} from '../components/profile-details-form';

export const ProfileDetailsPage: FC = () => {
	const { profile, fieldErrors, isMutating, updateProfile } = useProfile({
		callbacks: toastCallbacks
	});

	const initialData: Partial<ProfileDetailsFormData> = profile
		? {
				firstName: profile.first_name?.value ?? '',
				lastName: profile.last_name?.value ?? '',
				email: profile.email?.value ?? '',
				phone: profile.phone_number?.value ?? '',
				streetAddress: profile.address_line_1?.value ?? '',
				city: profile.city?.value ?? '',
				country: profile.country_code?.value ?? '',
				dateOfBirth: profile.date_of_birth?.value ?? ''
			}
		: {};

	const handleSubmit = async (data: ProfileDetailsFormData) => {
		await updateProfile({
			first_name: data.firstName,
			last_name: data.lastName,
			phone_number: data.phone,
			address_line_1: data.streetAddress,
			city: data.city,
			country_code: data.country,
			date_of_birth: data.dateOfBirth
		});
	};

	return (
		<div className="flex flex-col gap-6 grow">
			<ProfileDetailsForm
				initialData={initialData}
				onSubmit={handleSubmit}
				fieldErrors={fieldErrors}
				isMutating={isMutating}
			/>
			<ConnectedAccounts />
		</div>
	);
};
