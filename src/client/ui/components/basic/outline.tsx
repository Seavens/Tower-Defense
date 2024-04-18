import { Group } from "./group";
import { PALETTE } from "../../constants";
import { blend, composeBindings } from "@rbxts/pretty-react-hooks";
import { usePx } from "../../hooks";
import React, { useMemo } from "@rbxts/react";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";
import type { Element, PropsWithChildren } from "@rbxts/react";

interface OutlineProps extends PropsWithChildren {
	outlineTransparency?: BindingOrValue<number>;
	innerColor?: BindingOrValue<Color3>;
	outerColor?: BindingOrValue<Color3>;
	innerTransparency?: BindingOrValue<number>;
	outerTransparency?: BindingOrValue<number>;
	innerThickness?: BindingOrValue<number>;
	outerThickness?: BindingOrValue<number>;
	cornerRadius?: BindingOrValue<UDim>;
}

function ceilEven(n: number): number {
	return math.ceil(n / 2) * 2;
}

export function Outline({
	outlineTransparency = 0,
	innerColor = PALETTE.light_white,
	outerColor = PALETTE.black,
	innerTransparency = 0.9,
	outerTransparency = 0.85,
	innerThickness,
	outerThickness,
	cornerRadius,
	children,
}: OutlineProps): Element {
	const px = usePx();

	innerThickness ??= px(3);
	outerThickness ??= px(1.5);
	cornerRadius ??= new UDim(0, px(0.5));

	const innerStyle = useMemo(() => {
		const size = composeBindings(innerThickness!, (thickness) => {
			return new UDim2(1, ceilEven(-2 * thickness), 1, ceilEven(-2 * thickness));
		});

		const position = composeBindings(innerThickness!, (thickness) => {
			return new UDim2(0, thickness, 0, thickness);
		});

		const radius = composeBindings(cornerRadius!, innerThickness!, (radius, thickness) => {
			return radius.sub(new UDim(0, thickness));
		});

		const transparency = composeBindings(outlineTransparency, innerTransparency, (a, b) => {
			return math.clamp(blend(a, b), 0, 1);
		});

		return { size, position, radius, transparency };
	}, [innerThickness, innerTransparency, cornerRadius, outlineTransparency, px]);

	const outerStyle = useMemo(() => {
		const transparency = composeBindings(outlineTransparency, outerTransparency, (a, b) => {
			return math.clamp(blend(a, b), 0, 1);
		});

		return { transparency };
	}, [outlineTransparency, outerTransparency]);

	return (
		<>
			<Group size={innerStyle.size} position={innerStyle.position}>
				<uicorner CornerRadius={innerStyle.radius} />
				<uistroke Color={innerColor} Transparency={innerStyle.transparency} Thickness={innerThickness}>
					{children}
				</uistroke>
			</Group>

			<Group>
				<uicorner CornerRadius={cornerRadius} />
				<uistroke Color={outerColor} Transparency={outerStyle.transparency} Thickness={outerThickness}>
					{children}
				</uistroke>
			</Group>
		</>
	);
}
