'use client';

import type { FC } from 'react';

export type StatusFilterValue = '' | 'active' | 'passive' | 'inactive';

interface StatusFilterProps {
	value: StatusFilterValue;
	onChange: (value: StatusFilterValue) => void;
}

export const StatusFilter: FC<StatusFilterProps> = ({ value, onChange }) => {
	return (
		<select
			value={value}
			onChange={(e) => onChange(e.target.value as StatusFilterValue)}
			className="h-9 rounded-lg border border-neutral-medium bg-section px-3 body-3 text-neutral outline-none cursor-pointer"
		>
			<option value="">All statuses</option>
			<option value="active">Active</option>
			<option value="passive">Passive</option>
			<option value="inactive">Inactive</option>
		</select>
	);
};
