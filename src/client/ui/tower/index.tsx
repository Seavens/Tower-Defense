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
		<DelayRender shouldRender={selected !== undefined} unmountDelay={1}>
			<Transition
				size={UDim2.fromOffset(px(TOWER_SIZE.X), px(TOWER_SIZE.Y))}
				position={new UDim2(0, px(10), 0.5, 0)}
				anchorPoint={new Vector2(0, 0.5)}
				groupTransparency={transparency}
				key={"tower-app"}
			>
				{tower !== undefined || (tower === undefined && previous !== undefined) ? (
					<Tower tower={(tower === undefined ? previous : tower)!} />
				) : undefined}
			</Transition>
		</DelayRender>
	);
}
