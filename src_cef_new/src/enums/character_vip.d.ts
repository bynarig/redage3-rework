export declare enum CharacterVipEnum {
	PLAYER,
	SILVER_VIP,
	GOLD_VIP,
	PLATINUM_VIP,
	DIAMOND_VIP,
	MEDIA_VIP,
}

type CharacterVipValue =
	| CharacterVipEnum.PLAYER
	| CharacterVipEnum.SILVER_VIP
	| CharacterVipEnum.GOLD_VIP
	| CharacterVipEnum.PLATINUM_VIP
	| CharacterVipEnum.DIAMOND_VIP
	| CharacterVipEnum.MEDIA_VIP;

declare const CharacterVip: readonly CharacterVipValue[];

export = CharacterVip;
