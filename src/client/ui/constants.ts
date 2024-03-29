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
};

export const SPRINGS = {
	...config.spring,
	bubbly: { tension: 400, friction: 14 },
	responsive: { tension: 400 },
	gentle: { tension: 250, friction: 30 },
	world: { tension: 180, friction: 30 },
} satisfies { [config: string]: SpringOptions };

export const PALETTE = {
	error: Color3.fromRGB(255, 0, 0),
	accent: Color3.fromRGB(0, 255, 255),
};
