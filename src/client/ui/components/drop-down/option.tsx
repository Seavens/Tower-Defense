import { Button, DelayRender, Group, Text } from "../basic";
import { Darken } from "@rbxts/colour-utils";
import { FONTS, SPRINGS } from "client/ui/constants";
import { Latte, Mocha } from "@rbxts/catppuccin";
import { useButtonAnimation } from "client/ui/hooks/use-button-animation";
import { useButtonState } from "client/ui/hooks/use-button-state";
import { useMotion, usePx } from "client/ui/hooks";
import React, { useEffect } from "@rbxts/react";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";
import type { Element } from "@rbxts/react";

interface DropdownOptionProps {
	size: BindingOrValue<UDim2>;
	text: string;
	enabled: boolean;
	visible: boolean;
	onLeftClick?: () => void;
	onRightClick?: () => void;
	backgroundColor: Color3;
}

export function DropdownOption({
	size,
	text,
	enabled,
	visible,
	onLeftClick,
	onRightClick,
	backgroundColor,
}: DropdownOptionProps): Element {
	const px = usePx();

	const [pressed, hovering, events] = useButtonState(enabled);
	const { hover } = useButtonAnimation(pressed, hovering);

	const [transparency, transparencyMotion] = useMotion(1);

	useEffect((): void => {
		transparencyMotion.spring(visible ? 0 : 1, SPRINGS.responsive);
	}, [visible]);

	return (
		<DelayRender shouldRender={visible} unmountDelay={0.25}>
			<Group
				size={size ?? new UDim2(1, -px(3), 0, px(16))}
				anchorPoint={Vector2.one.mul(0.5)}
				key={"option-group"}
			>
				<Button
					size={new UDim2(1, -px(4), 1, 0)}
					position={UDim2.fromScale(0, 0)}
					anchorPoint={Vector2.zero}
					cornerRadius={new UDim(0, px(3))}
					key={"option-button"}
					backgroundColor={hover.map((value: number): Color3 => backgroundColor.Lerp(Mocha.Overlay0, value))}
					backgroundTransparency={transparency}
					active={false}
					event={{
						MouseButton1Click: (): void => onLeftClick?.(),
						MouseButton2Click: (): void => onRightClick?.(),
					}}
					{...events}
				>
					<Text
						size={UDim2.fromScale(1, 1)}
						anchorPoint={Vector2.one.mul(0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						font={FONTS.inter.regular}
						text={text}
						textColor={Latte.Base}
						textWrapped={true}
						textSize={px(12)}
						textTransparency={transparency}
						key={"option-text"}
					/>
				</Button>
			</Group>
		</DelayRender>
	);
}
