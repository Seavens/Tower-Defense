export const ASSET_IDS = {
	// Images

	// Sounds
	ElectricExplosion: "rbxassetid://2674547670",
	ThunderSpear: "rbxassetid://6903182307",
	BoomImpact: "rbxassetid://9125402735",
	WarpCharge: "rbxassetid://181004943",
	Blast: "rbxassetid://618826713",
	PistolBlast: "rbxassetid://1145253456",
	Fireball: "rbxassetid://6289220757",
	// Animations
	Walk: "rbxassetid://17071612480",
	Jump: "rbxassetid://125750702",
	Summon: "rbxassetid://17125440368",
	Attack: "rbxassetid://17109034511",
	Sell: "rbxassetid://17125215758",
	Idle: "rbxassetid://17133735528",
} as const;
ASSET_IDS satisfies { [K in keyof typeof ASSET_IDS]: RBXAssetId };
