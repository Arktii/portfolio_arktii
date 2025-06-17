import { BadgeType } from '$lib/types/projectTypes';

export function chooseBadgeColor(badgeType: BadgeType): [string, string] {
	if (badgeType == BadgeType.Language) {
		return ['#d8d9da', '#171412'];
	} else if (badgeType == BadgeType.Framework) {
		return ['#e2d9be', '#171412'];
	} else {
		return ['#8a7f71', '#171412'];
	}
}
