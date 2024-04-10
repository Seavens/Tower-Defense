import { UIKind } from "./types";
import { config } from "@rbxts/ripple";
import type { SpringOptions } from "@rbxts/ripple";

export const FONTS = {
	inter: {
		regular: new Font("rbxassetid://12187365364"),
		medium: new Font("rbxassetid://12187365364", Enum.FontWeight.Medium),
		bold: new Font("rbxassetid://12187365364", Enum.FontWeight.Bold),
	},
	robotoMono: {
		regular: Font.fromEnum(Enum.Font.RobotoMono),
	},
	nunito: {
		regular: Font.fromEnum(Enum.Font.Nunito),
	},
};

export const SPRINGS = {
	...config.spring,
	bubbly: { tension: 400, friction: 14 },
	responsive: { tension: 400 },
	gentle: { tension: 250, friction: 30 },
	world: { tension: 180, friction: 30 },
} satisfies { [config: string]: SpringOptions };

export const PALETTE = {
	error: Color3.fromRGB(247, 87, 87),
	accent: Color3.fromRGB(255, 255, 255),

	gray: Color3.fromRGB(55, 55, 55),
	red: Color3.fromRGB(247, 87, 87),
	green: Color3.fromRGB(82, 217, 77),
	blue: Color3.fromRGB(56, 87, 207),

	light_white: Color3.fromRGB(199, 199, 199),
	light_gray: Color3.fromRGB(130, 130, 130),
	light_blue: Color3.fromRGB(79, 181, 227),
	light_green: Color3.fromRGB(94, 227, 82),
	light_red: Color3.fromRGB(230, 51, 51),

	dark_blue: Color3.fromRGB(15, 15, 120),
	dark_green: Color3.fromRGB(0, 74, 5),
	dark_red: Color3.fromRGB(105, 0, 0),

	black: Color3.fromRGB(30, 30, 30),
	white: Color3.fromRGB(230, 230, 230),

	positive: Color3.fromRGB(232, 191, 10).ToHex(),
	negative: Color3.fromRGB(255, 0, 0).ToHex(),

	brown: Color3.fromRGB(135, 102, 102),
};

export const PADDING = 3;

export const UI_PRIORITIES: { [K in UIKind]: number } = {
	[UIKind.Inventory]: 5,
} as const;
