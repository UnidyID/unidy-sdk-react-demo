'use client';

import type { HookCallbacks } from '@unidy.io/sdk-react';
import { toast } from 'sonner';

export const fetchCallbackOptions: HookCallbacks = {
	onError: (err) => toast.error(err)
};

export const mutationCallbackOptions: HookCallbacks = {
	onSuccess: (msg) => toast.success(msg),
	onError: (err) => toast.error(err)
};
