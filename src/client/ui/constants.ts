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

	gray: Color3.fromRGB(100, 100, 100),
	red: Color3.fromRGB(255, 0, 0),
	green: Color3.fromRGB(0, 158, 0),
	blue: Color3.fromRGB(0, 0, 255),

	lightWhite: Color3.fromRGB(199, 199, 199),
	lightBlue: Color3.fromRGB(51, 153, 255),
	lightGreen: Color3.fromRGB(102, 255, 102),
	lightRed: Color3.fromRGB(230, 51, 51),

	black: Color3.fromRGB(0, 0, 0),
	white: Color3.fromRGB(255, 255, 255),

	positive: Color3.fromRGB(232, 191, 10).ToHex(),
	negative: Color3.fromRGB(255, 0, 0).ToHex(),
};
