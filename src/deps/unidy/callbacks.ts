'use client';

import type { HookCallbacks } from '@unidy.io/sdk-react';
import { toast } from 'sonner';
import { translateAuthError } from '@/locales/translate-auth-error';

export const fetchCallbackOptions: HookCallbacks = {
	onError: (err) => toast.error(translateAuthError(err))
};

export const mutationCallbackOptions: HookCallbacks = {
	onSuccess: (msg) => toast.success(msg),
	onError: (err) => toast.error(translateAuthError(err))
};
