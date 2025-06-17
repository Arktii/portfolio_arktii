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
	image: string;
	title: string;
	description: string;
	link?: string;
	badges: BadgeInfo[];
}
