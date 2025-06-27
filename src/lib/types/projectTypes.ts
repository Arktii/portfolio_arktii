export enum BadgeType {
	Language,
	Framework,
	Platform
}

export interface BadgeInfo {
	name: string;
	type: BadgeType;
}

export interface ProjectCardInfo {
	images: string[];
	title: string;
	description: string;
	date: string;
	link?: string;
	badges: BadgeInfo[];
}
