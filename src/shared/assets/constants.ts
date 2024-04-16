export const ASSET_IDS = {
	// Images
	RPG: "rbxassetid://14448210845",

	// Sounds
	ElectricExplosion: "rbxassetid://2674547670",
	ThunderSpear: "rbxassetid://6903182307",
	BoomImpact: "rbxassetid://9125402735",
	WarpCharge: "rbxassetid://181004943",
	Blast: "rbxassetid://618826713",
	PistolBlast: "rbxassetid://1145253456",
	Fireball: "rbxassetid://6289220757",
	Lobby: "rbxassetid://1839945406",
	WhooshSuction: "rbxassetid://9120736816",
	ElectricSpark: "rbxassetid://624552683",
	LightningFlashes: "rbxassetid://9116272906",
	SilentGlitcher: "rbxassetid://7390331288",

	// Animations
	WalkR6: "rbxassetid://17140384803",
	WalkR15: "rbxassetid://913402848",
	Jump: "rbxassetid://125750702",
	Summon: "rbxassetid://17125440368",
	Attack: "rbxassetid://17109034511",
	Sell: "rbxassetid://17125215758",
	Idle: "rbxassetid://17133735528",
} as const;
ASSET_IDS satisfies { [K in keyof typeof ASSET_IDS]: RBXAssetId };
