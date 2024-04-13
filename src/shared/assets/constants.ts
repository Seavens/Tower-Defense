export const ASSET_IDS = {
	// Images

	// Sounds
	ElectricExplosion: "rbxassetid://2674547670",
	ThunderSpear: "rbxassetid://6903182307",
	BoomImpact: "rbxassetid://9125402735",

	// Animations
	Walk: "rbxassetid://17071612480",
	Jump: "rbxassetid://125750702",
	Summon: "rbxassetid://17107797565",
	Attack: "rbxassetid://17109034511",
	Sell: "rbxassetid://17123581417",
} as const;
ASSET_IDS satisfies { [K in keyof typeof ASSET_IDS]: RBXAssetId };
