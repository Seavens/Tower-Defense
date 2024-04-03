import { DelayRender, Group, Transition } from "client/ui/components";
import { SPRINGS } from "client/ui/constants";
import { SlotAction } from "./action";
import { useMotion } from "client/ui/hooks";
import React, { useEffect, useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";

interface SlotActionsProps<T extends string> {
	visible: boolean;
	actions: Array<T>;
	onClick?: (action: T) => void;
}

export function SlotActions<T extends string>({ visible, actions, onClick }: SlotActionsProps<T>): Element {
	const [transparency, transparencyMotion] = useMotion(0);

	const elements = useMemo((): Array<Element> => {
		const elements = new Array<Element>();
		for (const action of actions) {
			const element = (
				<SlotAction
					text={action}
					enabled={visible}
					options={actions.size()}
					onClick={(): void => {
						onClick?.(action);
					}}
				/>
			);
			elements.push(element);
		}
		return elements;
	}, [visible, actions]);

	useEffect((): void => {
		transparencyMotion.spring(visible ? 0 : 1, SPRINGS.responsive);
	}, [visible]);

	return (
		<DelayRender shouldRender={visible} unmountDelay={0.5}>
			<Transition
				size={UDim2.fromScale(1, 1)}
				position={UDim2.fromScale(0.5, 0.5)}
				anchorPoint={Vector2.one.mul(0.5)}
				groupTransparency={transparency}
				zIndex={10}
				key={"actions-transition"}
			>
				<Group
					size={UDim2.fromScale(1, 1)}
					position={UDim2.fromScale(0.5, 0.5)}
					anchorPoint={Vector2.one.mul(0.5)}
					zIndex={10}
					key={"actions-group"}
				>
					{elements}
					<uilistlayout
						FillDirection={"Vertical"}
						HorizontalAlignment={"Center"}
						VerticalAlignment={"Center"}
						SortOrder={"LayoutOrder"}
						Padding={new UDim(0, 0)}
						key={"actions-layout"}
					/>
				</Group>
			</Transition>
		</DelayRender>
	);
}
