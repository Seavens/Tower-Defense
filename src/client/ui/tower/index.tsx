import { DelayRender, Transition } from "../components";
import { SPRINGS } from "../constants";
import { TOWER_SIZE } from "./constants";
import { Tower } from "./tower";
import { selectSelectedTower } from "client/tower/selectors";
import { selectSpecificTower } from "shared/tower/selectors";
import { useCamera, usePrevious } from "@rbxts/pretty-react-hooks";
import { useMotion, usePx } from "../hooks";
import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import React, { useEffect, useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function TowerApp(): Element {
	const px = usePx();

	const selected = useSelector(selectSelectedTower);
	const tower = useSelectorCreator(selectSpecificTower, selected);
	const previous = usePrevious(tower);

	const visible = selected !== undefined;
	const [transparency, transparencyMotion] = useMotion(1);
	const camera = useCamera();

	const side = useMemo((): "Left" | "Right" => {
		if (tower === undefined) {
			return "Right";
		}
		const { position } = tower;
		const old = previous?.position;
		if (old !== undefined && position.FuzzyEq(old, 1e-2)) {
			return last ?? "Right";
		}
		const viewport = camera.ViewportSize;
		const [point] = camera.WorldToScreenPoint(tower?.position ?? Vector3.zero);
		const half = new Vector2(viewport.X / 2, viewport.Y);
		const x = point.X;
		if (x >= half.X) {
			return "Left";
		}
		return "Right";
	}, [camera, visible, tower]);
	const last = usePrevious(side);

	useEffect((): void => {
		transparencyMotion.spring(visible ? 0 : 1, SPRINGS.gentle);
	}, [visible]);

	return (
		<DelayRender shouldRender={visible} unmountDelay={1}>
			<Transition
				size={UDim2.fromOffset(px(TOWER_SIZE.X + 4), px(TOWER_SIZE.Y + 4))}
				anchorPoint={new Vector2((visible ? side : last) === "Left" ? 0 : 1, 0.5)}
				position={
					new UDim2(side === "Left" ? 0 : 1, ((visible ? side : last) === "Left" ? 1 : -1) * px(10), 0.5, 0)
				}
				groupTransparency={transparency}
				clipsDescendants={false}
				key={"tower-app"}
			>
				{tower !== undefined || (tower === undefined && previous !== undefined) ? (
					<Tower tower={(tower === undefined ? previous : tower)!} />
				) : undefined}
			</Transition>
		</DelayRender>
	);
}
