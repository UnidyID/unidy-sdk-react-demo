'use client';

import { toast } from 'sonner';
import type { HookCallbacks } from '@unidy.io/sdk-react';

export const toastCallbacks: HookCallbacks = {
	onSuccess: (msg) => toast.success(msg),
	onError: (err) => toast.error(err),
};
