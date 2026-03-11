export function formatPrice(price: number | null, currency: string | null): string {
	if (price == null) return 'Free';
	if (!currency) return `$${price.toFixed(2)}`;
	try {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency
		}).format(price);
	} catch {
		return `${price.toFixed(2)} ${currency}`;
	}
}

export function formatDate(date: Date | null): string {
	if (!date) return 'N/A';
	return new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	}).format(new Date(date));
}

export function formatTime(date: Date): string {
	return new Intl.DateTimeFormat('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	}).format(new Date(date));
}

export function mapItemState(state: string): 'active' | 'passive' | 'inactive' {
	switch (state.toLowerCase()) {
		case 'active':
			return 'active';
		case 'passive':
			return 'passive';
		default:
			return 'inactive';
	}
}
