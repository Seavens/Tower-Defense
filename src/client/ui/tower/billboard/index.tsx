import { BILLBOARD_SIZE } from "./constants";
import { Tower } from "client/tower/class";
import { TowerBillboard } from "./billboard";
import { selectPlacedTowers } from "shared/tower/selectors";
import { useSelector } from "@rbxts/react-reflex";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function TowerBillboards(): Element {
	const towers = useSelector(selectPlacedTowers);

	const billboards = useMemo((): Array<Element> => {
		const billboards = new Array<Element>();
		for (const [key, replcated] of towers) {
			const tower = Tower.getTower(key);
			if (tower === undefined) {
				continue;
			}
			const { instance } = tower;
			const root = instance.FindFirstChild("HumanoidRootPart");
			let adornee: Model | BasePart = instance;
			if (root !== undefined && root.IsA("BasePart")) {
				adornee = root;
			}
			const size = instance.GetExtentsSize().div(2);
			const height = size.Y;
			const element = (
				<billboardgui
					Size={UDim2.fromScale(BILLBOARD_SIZE.X, BILLBOARD_SIZE.Y)}
					Adornee={adornee}
					AlwaysOnTop={false}
					Enabled={true}
					MaxDistance={100}
					ExtentsOffsetWorldSpace={new Vector3(0, height + 1, 0)}
				>
					<TowerBillboard replicatedTower={replcated} />
				</billboardgui>
			);
			billboards.push(element);
		}
		return billboards;
	}, [towers]);

	return <>{billboards}</>;
}
