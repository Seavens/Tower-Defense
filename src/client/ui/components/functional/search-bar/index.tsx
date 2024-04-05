import { type BindingOrValue, composeBindings, lerp, map } from "@rbxts/pretty-react-hooks";
import { Button, TextField } from "../../basic";
import { FONTS, PADDING, PALETTE, SPRINGS } from "client/ui/constants";
import { levenshteinDamerau } from "./utility";
import { useButtonAnimation, useButtonState, useMotion, usePx } from "client/ui/hooks";
import React, { useEffect, useMemo, useState } from "@rbxts/react";
import type { Element, InferEnumNames } from "@rbxts/react";

export interface SearchBarProps {
	size: BindingOrValue<UDim2>;
	position: BindingOrValue<UDim2>;
	anchorPoint: BindingOrValue<Vector2>;
	cornerRadius?: BindingOrValue<UDim>;
	backgroundColor?: BindingOrValue<Color3>;
	backgroundTransparency?: BindingOrValue<number>;
	textColor?: Color3;
	textSize: number;
	textWrapped?: BindingOrValue<boolean>;
	textXAlignment?: InferEnumNames<Enum.TextXAlignment>;
	textTruncate?: InferEnumNames<Enum.TextTruncate>;
	textAutoResize?: "X" | "Y" | "XY";
	clearTextOnFocus?: boolean;
	richText?: BindingOrValue<boolean>;
	font?: Font;
	enabled: boolean;
	queries: Array<string>;
	accuracy?: number;
	layoutOrder?: number;
	onSearch?: (matches?: Array<string>) => void;
}

export function SearchBar({
	size,
	position,
	anchorPoint,
	cornerRadius,
	backgroundColor = PALETTE.black,
	backgroundTransparency = 0.35,
	textColor = PALETTE.white,
	textSize,
	textWrapped = true,
	textXAlignment,
	textTruncate,
	textAutoResize,
	clearTextOnFocus,
	richText,
	font = FONTS.nunito.regular,
	enabled,
	accuracy = 3,
	queries,
	layoutOrder,
	onSearch,
}: SearchBarProps): Element {
	const px = usePx();

	const [pressed, hovering, events] = useButtonState(enabled);
	const { hover, position: animated } = useButtonAnimation(pressed, hovering);

	const [transparency, transparencyMotion] = useMotion(1);
	const [search, setSearch] = useState<string>();

	const matches = useMemo((): Option<Array<string>> => {
		if (search === undefined) {
			return undefined;
		}
		const matches = new Array<string>();
		for (const query of queries) {
			const [match] = query.lower().find(`^${search.lower()}`);
			if (match === undefined) {
				continue;
			}
			matches.push(query);
		}
		for (const query of queries) {
			const levenshtein = levenshteinDamerau(search, query);
			if (levenshtein > accuracy) {
				continue;
			}
			matches.push(query);
		}
		return matches;
	}, [search, queries, accuracy]);

	useEffect((): void => {
		transparencyMotion.spring(enabled ? 0 : 1, SPRINGS.responsive);
	}, [enabled]);

	return (
		<Button
			size={size}
			position={position}
			anchorPoint={anchorPoint}
			backgroundTransparency={1}
			layoutOrder={layoutOrder}
			{...events}
			key={"search-group"}
		>
			<TextField
				size={UDim2.fromScale(1, 1)}
				position={animated.map((value: number): UDim2 => {
					return UDim2.fromScale(0.5, 0.5).Lerp(new UDim2(0.5, 0, 0.5, px(1)), value);
				})}
				anchorPoint={Vector2.one.mul(0.5)}
				cornerRadius={cornerRadius}
				backgroundColor={composeBindings(
					hover,
					backgroundColor,
					(value: number, color: Color3): Color3 => color.Lerp(PALETTE.white, value / 3),
				)}
				backgroundTransparency={composeBindings(
					transparency,
					backgroundTransparency,
					(alpha: number, transparency: number): number => lerp(transparency, 0.75, alpha),
				)}
				textColor={textColor}
				textSize={textSize}
				textTransparency={transparency.map((value: number): number => map(value, 0, 1, 0, 0.5))}
				textWrapped={textWrapped}
				textXAlignment={textXAlignment}
				textTruncate={textTruncate}
				textAutoResize={textAutoResize}
				clearTextOnFocus={enabled ? clearTextOnFocus : false}
				placeholderText={"Search"}
				placeholderColor={PALETTE.light_white}
				textEditable={enabled}
				richText={richText}
				font={font}
				change={{
					Text: (rbx: TextBox): void => {
						const text = rbx.Text;
						const [characters] = text.gsub("%s+", "");
						if (characters.size() <= 0) {
							setSearch(undefined);
							return;
						}
						setSearch(text);
					},
				}}
				event={{
					Focused: (rbx: TextBox): void => {
						rbx.Text = "";
						setSearch(undefined);
					},
					FocusLost: (rbx: TextBox, enter: boolean): void => {
						onSearch?.(matches);
					},
				}}
				key={"search-field"}
			>
				<uipadding
					PaddingBottom={new UDim(0, px(PADDING))}
					PaddingLeft={new UDim(0, px(PADDING))}
					PaddingRight={new UDim(0, px(PADDING))}
					PaddingTop={new UDim(0, px(PADDING))}
					key={"search-padding"}
				/>
			</TextField>
		</Button>
	);
}
