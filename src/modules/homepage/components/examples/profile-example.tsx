'use client';

import { useProfile } from '@unidy.io/sdk-react';
import { toastCallbacks } from '@/deps/unidy/callbacks';
import {
	ProfileDetailsForm,
	type ProfileDetailsFormData
} from '@/modules/profile/components/profile-details-form';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';

export const ProfileExample = () => {
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
		<SDKWrapper
			title="Profile SDK / useProfile"
			codeSnippet={`const { profile, fieldErrors, isMutating, updateProfile } = useProfile({
  callbacks: toastCallbacks
});`}
			size="lg"
			labelPosition="top-left"
			detatched
			popoverPosition="left"
		>
			<ProfileDetailsForm
				initialData={initialData}
				onSubmit={handleSubmit}
				fieldErrors={fieldErrors}
				isMutating={isMutating}
				className="border-0 p-0 bg-transparent"
				sections={['personal', 'address']}
			/>
		</SDKWrapper>
	);
};
