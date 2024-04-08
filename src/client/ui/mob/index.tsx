import { BILLBOARD_SIZE } from "./constants";
import { Mob } from "client/mob/class";
import { MobHealthbar } from "./health-bar";
import { useEventListener, useUpdate } from "@rbxts/pretty-react-hooks";
import { usePx } from "../hooks";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";

export function MobApp(): Element {
	const px = usePx();

	const update = useUpdate();

	const billboards = useMemo((): Array<Element> => {
		const billboards = new Array<Element>();
		for (const [, mob] of Mob.getMobs()) {
			const { id } = mob;
			const health = mob.getHealth();
			const element = (
				<billboardgui
					Size={UDim2.fromOffset(px(BILLBOARD_SIZE.X), px(BILLBOARD_SIZE.Y))}
					Adornee={mob.getInstance()}
					AlwaysOnTop={false}
					Enabled={true}
					MaxDistance={100}
					ExtentsOffsetWorldSpace={new Vector3(0, 3, 0)} // Temporary, base this off mob height
				>
					<MobHealthbar id={id} health={health} />
				</billboardgui>
			);
			billboards.push(element);
		}
		return billboards;
	}, [px, update]);

	useEventListener(Mob.onMobAdded, (): void => {
		update();
	});

	useEventListener(Mob.onMobRemoved, (): void => {
		update();
	});

	useEventListener(Mob.onMobDamaged, (): void => {
		update();
	});

	return <>{billboards}</>;
}
