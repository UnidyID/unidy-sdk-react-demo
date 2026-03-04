import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import { SDKWrapper } from '@/modules/sdk-element/components/sdk-element';
import { Mail, Phone, Save, User } from 'lucide-react';

export const ProfileExample = () => {
	return (
		<SDKWrapper
			title="Profile SDK / useProfile"
			codeSnippet={`const { profile, updateProfile } = useProfile({
  callbacks: toastCallbacks
});`}
			size="lg"
			labelPosition="top-left"
			detatched
			popoverPosition="left"
		>
			{/* Full Name Input */}
			<SDKWrapper
				title="Profile SDK / Name Input"
				codeSnippet="profile.first_name?.value"
				size="sm"
				popoverPosition="left"
				className="flex flex-col gap-2"
			>
				<FormLabel title="Full Name">
					<div className="border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4 bg-section">
						<User className="size-5 text-neutral-medium shrink-0" />
						<input
							type="text"
							placeholder="John Doe"
							defaultValue="John Doe"
							className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
						/>
					</div>
				</FormLabel>
			</SDKWrapper>

			{/* Email Input */}
			<div className="flex flex-col gap-2 relative">
				<SDKWrapper
					title="Profile SDK / Email Input"
					codeSnippet="profile.email?.value"
					size="sm"
					popoverPosition="left"
					className="flex flex-col gap-2"
				>
					<FormLabel title="Email Address">
						<div className="border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4 bg-section">
							<Mail className="size-5 text-neutral-medium shrink-0" />
							<input
								type="email"
								placeholder="john.doe@example.com"
								defaultValue="john.doe@example.com"
								className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
								readOnly
							/>
						</div>
					</FormLabel>
				</SDKWrapper>

				{/* Phone Number Input */}
				<SDKWrapper
					title="Profile SDK / Phone Input"
					codeSnippet="profile.phone_number?.value"
					size="sm"
					popoverPosition="left"
					className="flex flex-col gap-2"
				>
					<FormLabel title="Phone Number">
						<div className="border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4 bg-section">
							<Phone className="size-5 text-neutral-medium shrink-0" />
							<input
								type="tel"
								placeholder="+1 (555) 123-4567"
								defaultValue="+1 (555) 123-4567"
								className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
							/>
						</div>
					</FormLabel>
				</SDKWrapper>

				{/* Bio Textarea */}
				<SDKWrapper
					title="Profile SDK / Custom Attribute"
					codeSnippet="updateProfile({ bio: value })"
					size="sm"
					popoverPosition="left"
					className="flex flex-col gap-2"
				>
					<FormLabel title="Bio (Custom Attribute)">
						<textarea
							placeholder="How's your day going?"
							defaultValue=""
							rows={4}
							className="border border-neutral-medium rounded-[10px] h-[107px] p-4 resize-none outline-none input text-neutral placeholder:text-neutral-medium bg-section"
						/>
					</FormLabel>
				</SDKWrapper>

				{/* Save Button */}
				<SDKWrapper
					title="Profile SDK / Submit"
					codeSnippet="updateProfile({ first_name, last_name, ... })"
					size="sm"
					popoverPosition="left"
				>
					<Button theme="accent" variant="solid" size="lg" className="w-full">
						<Save />
						Save Changes
					</Button>
				</SDKWrapper>
			</div>
		</SDKWrapper>
	);
};
