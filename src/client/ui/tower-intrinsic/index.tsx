import { DelayRender, Transition } from "../components";
import { SPRINGS } from "../constants";
import { TOWER_SIZE } from "./constants";
import { Tower } from "./tower";
import { selectSelectedTower } from "client/tower/selectors";
import { selectSpecificTower } from "shared/tower/selectors";
import { useMotion, usePx } from "../hooks";
import { usePrevious } from "@rbxts/pretty-react-hooks";
import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import React, { useEffect } from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function TowerApp(): Element {
	const px = usePx();

	const selected = useSelector(selectSelectedTower);
	const tower = useSelectorCreator(selectSpecificTower, selected);
	const previous = usePrevious(tower);

	const visible = selected !== undefined;
	const [transparency, transparencyMotion] = useMotion(1);

	useEffect((): void => {
		transparencyMotion.spring(visible ? 0 : 1, SPRINGS.gentle);
	}, [visible]);

	return (
		<DelayRender shouldRender={visible} unmountDelay={1}>
			<Transition
				// size={UDim2.fromScale(1, 1)}
				// position={UDim2.fromScale(0.5, 0.5)}
				// anchorPoint={new Vector2(0.5, 0.5)}
				size={UDim2.fromOffset(px(TOWER_SIZE.X + 4), px(TOWER_SIZE.Y + 4))}
				position={new UDim2(1, -px(10), 0.5, 0)}
				anchorPoint={new Vector2(1, 0.5)}
				groupTransparency={transparency}
				clipsDescendants={false}
				key={"tower-app"}
			>
				{tower !== undefined || (tower === undefined && previous !== undefined) ? (
					<Tower tower={(tower === undefined ? previous : tower)!} side={"Right"} />
				) : undefined}
			</Transition>
		</DelayRender>
	);
}
