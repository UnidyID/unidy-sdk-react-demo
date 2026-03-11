'use client';

import type { HookCallbacks } from '@unidy.io/sdk-react';
import { toast } from 'sonner';

export const toastCallbacks: HookCallbacks = {
	// onSuccess: (msg) => toast.success(msg),
	onError: (err) => toast.error(err)
};
