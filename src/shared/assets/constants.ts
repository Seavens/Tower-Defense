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
	Click: "rbxassetid://452267918",
	UIClick: "rbxassetid://6895079853",
	WinterHolidays: "rbxassetid://9046740461",
	LightSpell: "rbxassetid://5405460805",
	TwinkleMagic: "rbxassetid://5405460805",
	DownTen: "rbxassetid://9043357509",
	DemonOne: "rbxassetid://9114228578",
	DemonTwo: "rbxassetid://9114228524",
	DemonThree: "rbxassetid://9067471663",
	DemonFour: "rbxassetid://9114038256",
	DemonFive: "rbxassetid://9067394653",

	// Animations
	WalkR6: "rbxassetid://17140384803",
	WalkR15: "rbxassetid://913402848",
	Jump: "rbxassetid://125750702",
	Summon: "rbxassetid://17125440368",
	EDSummon: "rbxassetid://17167166005",
	Attack: "rbxassetid://17109034511",
	Sell: "rbxassetid://17125215758",
	Idle: "rbxassetid://17133735528",
} as const;
ASSET_IDS satisfies { [K in keyof typeof ASSET_IDS]: RBXAssetId };
