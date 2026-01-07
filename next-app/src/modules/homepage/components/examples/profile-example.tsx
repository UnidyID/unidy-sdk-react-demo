import { FormLabel } from '@/components/form-label';
import { Button } from '@/components/shadcn/ui/button';
import { SDKElement } from '@/modules/sdk-element/components/sdk-element';
import { Mail, Phone, Save, User } from 'lucide-react';

export const ProfileExample = () => {
	return (
		<div className="relative">
			<SDKElement
				title="Profile SDK / Profile Form"
				codeSnippet="<ProfileForm />"
				size="lg"
				labelPosition="top-left"
				detatched
				popoverPosition="left"
			/>
			<div className="flex flex-col gap-6 w-full">
				{/* Full Name Input */}
				<div className="flex flex-col gap-2 relative">
					<SDKElement
						title="Profile SDK / Name Input"
						codeSnippet="<input type='text' name='name' />"
						size="sm"
						popoverPosition="left"
					/>
					<FormLabel title="Full Name">
						<div className="border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4">
							<User className="size-5 text-neutral-medium shrink-0" />
							<input
								type="text"
								placeholder="John Doe"
								defaultValue="John Doe"
								className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
							/>
						</div>
					</FormLabel>
				</div>

				{/* Email Input */}
				<div className="flex flex-col gap-2 relative">
					<SDKElement
						title="Profile SDK / Email Input"
						codeSnippet="<input type='email' name='email' />"
						size="sm"
						popoverPosition="left"
					/>
					<FormLabel title="Email Address">
						<div className="border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4">
							<Mail className="size-5 text-neutral-medium shrink-0" />
							<input
								type="email"
								placeholder="john.doe@example.com"
								defaultValue="john.doe@example.com"
								className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
							/>
						</div>
					</FormLabel>
				</div>

				{/* Phone Number Input */}
				<div className="flex flex-col gap-2 relative">
					<SDKElement
						title="Profile SDK / Phone Input"
						codeSnippet="<input type='tel' name='phone' />"
						size="sm"
						popoverPosition="left"
					/>
					<FormLabel title="Phone Number">
						<div className="border border-neutral-medium rounded-[10px] h-[50px] flex gap-2 items-center px-4">
							<Phone className="size-5 text-neutral-medium shrink-0" />
							<input
								type="tel"
								placeholder="+1 (555) 123-4567"
								defaultValue="+1 (555) 123-4567"
								className="flex-1 bg-transparent border-0 outline-none input text-neutral placeholder:text-neutral-medium"
							/>
						</div>
					</FormLabel>
				</div>

				{/* Bio Textarea */}
				<div className="flex flex-col gap-2 relative">
					<SDKElement
						title="Profile SDK / Custom Attribute"
						codeSnippet="<textarea name='bio' />"
						size="sm"
						popoverPosition="left"
					/>
					<FormLabel title="Bio (Custom Attribute)">
						<textarea
							placeholder="How's your day going?"
							defaultValue=""
							rows={4}
							className="border border-neutral-medium rounded-[10px] h-[107px] p-4 resize-none bg-transparent outline-none input text-neutral placeholder:text-neutral-medium"
						/>
					</FormLabel>
				</div>

				{/* Save Button */}
				<div className="relative">
					<SDKElement
						title="Profile SDK / Submit"
						codeSnippet="<button type='submit'>Save Changes</button>"
						size="sm"
						popoverPosition="left"
					/>
					<Button theme="accent" variant="solid" size="lg" className="w-full">
						<Save />
						Save Changes
					</Button>
				</div>
			</div>
		</div>
	);
};
