import { BadgeType } from '$lib/types/projectDisplay';

export function chooseBadgeColor(badgeType: BadgeType): string {
	if (badgeType == BadgeType.Language) {
		return '#d8d9da';
	} else if (badgeType == BadgeType.Framework) {
		return '#e2d9be';
	} else {
		return '#8a7f71';
	}
}
