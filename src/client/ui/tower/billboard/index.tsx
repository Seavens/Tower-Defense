import { BILLBOARD_SIZE } from "client/ui/game/constants";
import { Tower } from "client/tower/class";
import { TowerBillboard } from "./billboard";
import { selectPlacedTowers } from "shared/tower/selectors";
import { usePx } from "client/ui/hooks";
import { useSelector } from "@rbxts/react-reflex";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function TowerBillboardApp(): Element {
	const px = usePx();

	const towers = useSelector(selectPlacedTowers);

	const billboards = useMemo((): Array<Element> => {
		const billboards = new Array<Element>();
		for (const [key, { unique }] of towers) {
			const _tower = Tower.getTower(key);
			if (_tower === undefined) continue;

			const owner = _tower;
			if (owner !== undefined) continue;

			const element = (
				<billboardgui
					Size={UDim2.fromScale(px(BILLBOARD_SIZE.X), px(BILLBOARD_SIZE.Y))}
					Adornee={_tower.instance}
					AlwaysOnTop={false}
					Enabled={true}
					MaxDistance={100}
					ExtentsOffsetWorldSpace={new Vector3(0, _tower.instance.GetExtentsSize().Y / 2, 0)}
				>
					<TowerBillboard owner={owner} unique={unique} />
				</billboardgui>
			);
		}

		return billboards;
	}, [px]);

	return <>{billboards}</>;
}
