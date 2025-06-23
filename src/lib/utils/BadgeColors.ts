import { BadgeType } from '$lib/types/projectTypes';

export function chooseBadgeColor(badgeType: BadgeType): [string, string] {
	if (badgeType == BadgeType.Language) {
		return ['var(--color-secondary)', 'var(--color-primary)'];
	} else if (badgeType == BadgeType.Framework) {
		return ['var(--color-secondary-accent)', 'var(--color-primary)'];
	} else {
		return ['var(--color-accent)', 'var(--color-primary)'];
	}
}
