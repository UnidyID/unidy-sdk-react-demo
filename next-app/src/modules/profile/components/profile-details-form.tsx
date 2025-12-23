'use client';

import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import {
	InputGroup,
	InputGroupInput
} from '@/components/shadcn/ui/input-group';
import { useState, type FC } from 'react';

export interface ProfileDetailsFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	streetAddress: string;
	city: string;
	country: string;
	dateOfBirth: string;
}

export interface ProfileDetailsFormProps {
	initialData?: Partial<ProfileDetailsFormData>;
	onSubmit?: (data: ProfileDetailsFormData) => void;
	onCancel?: () => void;
	className?: string;
}

export const ProfileDetailsForm: FC<ProfileDetailsFormProps> = ({
	initialData = {},
	onSubmit,
	onCancel,
	className
}) => {
	const [formData, setFormData] = useState<ProfileDetailsFormData>({
		firstName: initialData.firstName || '',
		lastName: initialData.lastName || '',
		email: initialData.email || '',
		phone: initialData.phone || '',
		streetAddress: initialData.streetAddress || '',
		city: initialData.city || '',
		country: initialData.country || '',
		dateOfBirth: initialData.dateOfBirth || ''
	});

	const handleChange =
		(field: keyof ProfileDetailsFormData) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData((prev) => ({ ...prev, [field]: e.target.value }));
		};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit?.(formData);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={`bg-section border border-neutral-weak rounded-[12px] p-[33px] flex flex-col gap-6 ${className || ''}`}
		>
			<h2 className="title-1 text-neutral">Profile Information</h2>

			<div className="flex flex-col gap-6">
				{/* Personal Information */}
				<div className="flex flex-col gap-4">
					<h3 className="title-3 text-neutral">Personal Information</h3>
					<div className="flex gap-3">
						<FormLabel title="First Name" required className="flex-1">
							<InputGroup>
								<InputGroupInput
									type="text"
									value={formData.firstName}
									onChange={handleChange('firstName')}
									className="text-neutral"
									placeholder="Text"
								/>
							</InputGroup>
						</FormLabel>
						<FormLabel title="Last Name" required className="flex-1">
							<InputGroup>
								<InputGroupInput
									type="text"
									value={formData.lastName}
									onChange={handleChange('lastName')}
									className="text-neutral"
									placeholder="Text"
								/>
							</InputGroup>
						</FormLabel>
					</div>
				</div>

				{/* Contact Information */}
				<div className="flex flex-col gap-4">
					<h3 className="title-3 text-neutral">Contact Information</h3>
					<div className="flex flex-col gap-4">
						<FormLabel title="Email Address" required>
							<InputGroup>
								<InputGroupInput
									type="email"
									value={formData.email}
									onChange={handleChange('email')}
									className="text-neutral"
									placeholder="Text"
								/>
							</InputGroup>
						</FormLabel>
						<FormLabel title="Phone Number" required>
							<InputGroup>
								<InputGroupInput
									type="tel"
									value={formData.phone}
									onChange={handleChange('phone')}
									className="text-neutral"
									placeholder="Text"
								/>
							</InputGroup>
						</FormLabel>
					</div>
				</div>

				{/* Address */}
				<div className="flex flex-col gap-4">
					<h3 className="title-3 text-neutral">Address</h3>
					<div className="flex flex-col gap-4">
						<FormLabel title="Street Address" required>
							<InputGroup>
								<InputGroupInput
									type="text"
									value={formData.streetAddress}
									onChange={handleChange('streetAddress')}
									className="text-neutral"
									placeholder="Text"
								/>
							</InputGroup>
						</FormLabel>
						<div className="flex gap-3">
							<FormLabel title="City" required className="flex-1">
								<InputGroup>
									<InputGroupInput
										type="text"
										value={formData.city}
										onChange={handleChange('city')}
										className="text-neutral"
										placeholder="Text"
									/>
								</InputGroup>
							</FormLabel>
							<FormLabel title="Country" required className="flex-1">
								<InputGroup>
									<InputGroupInput
										type="text"
										value={formData.country}
										onChange={handleChange('country')}
										className="text-neutral"
										placeholder="Text"
									/>
								</InputGroup>
							</FormLabel>
						</div>
					</div>
				</div>

				{/* Additional Information */}
				<div className="flex flex-col gap-4">
					<h3 className="title-3 text-neutral">Additional Information</h3>
					<FormLabel title="Date of Birth" required>
						<InputGroup>
							<InputGroupInput
								type="date"
								value={formData.dateOfBirth}
								onChange={handleChange('dateOfBirth')}
								className="text-neutral"
							/>
						</InputGroup>
					</FormLabel>
				</div>

				{/* Actions */}
				<div className="flex gap-4 pt-4 border-t border-section">
					<Button theme="accent" variant="solid" size="md" type="submit">
						Save changes
					</Button>
					<Button
						theme="neutral"
						variant="outline"
						size="md"
						type="button"
						onClick={onCancel}
					>
						Cancel
					</Button>
				</div>
			</div>
		</form>
	);
};
