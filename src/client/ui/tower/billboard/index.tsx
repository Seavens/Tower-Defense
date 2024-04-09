import { BILLBOARD_SIZE } from "client/ui/game/constants";
import { Tower } from "client/tower/class";
import { TowerBillboard } from "./billboard";
import { selectPlacedTowers } from "shared/tower/selectors";
import { usePx, useScale } from "client/ui/hooks";
import { useSelector } from "@rbxts/react-reflex";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function TowerBillboards(): Element {
	const px = usePx();

	const towers = useSelector(selectPlacedTowers);
	// const scale = useScale(new Vector2(px(BILLBOARD_SIZE.X), px(BILLBOARD_SIZE.Y)));
	// warn(scale);

	const billboards = useMemo((): Array<Element> => {
		const billboards = new Array<Element>();
		for (const [key, { unique }] of towers) {
			const tower = Tower.getTower(key);
			if (tower === undefined) {
				continue;
			}
			const { instance, owner } = tower;
			const size = instance.GetExtentsSize().div(2);
			const height = size.Y;
			const element = (
				<billboardgui
					// Size={UDim2.fromScale(scale.X, scale.Y)}
					Size={UDim2.fromScale(px(BILLBOARD_SIZE.X), px(BILLBOARD_SIZE.Y))}
					Adornee={instance}
					AlwaysOnTop={false}
					Enabled={true}
					MaxDistance={100}
					ExtentsOffsetWorldSpace={new Vector3(0, height + 1, 0)}
				>
					<TowerBillboard owner={owner} unique={unique} />
				</billboardgui>
			);
			billboards.push(element);
		}
		return billboards;
		// }, [towers, scale, px]);
	}, [towers, px]);

	return <>{billboards}</>;
}
