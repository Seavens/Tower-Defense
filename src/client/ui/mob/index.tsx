import { BILLBOARD_SIZE } from "./constants";
import { Frame } from "../components";
import { Mob } from "client/mob/class";
import { MobHealthbar } from "./health-bar";
import { mobDefinitions } from "shared/mob/definitions";
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
			const instance = mob.getInstance();
			const root = instance.FindFirstChild("HumanoidRootPart");
			let adornee: Model | BasePart = instance;
			if (root !== undefined && root.IsA("BasePart")) {
				adornee = root;
			}
			const { height } = mobDefinitions[id];
			const health = mob.getHealth();
			const element = (
				<billboardgui
					Size={UDim2.fromScale(px(BILLBOARD_SIZE.X), px(BILLBOARD_SIZE.Y))}
					Adornee={adornee}
					AlwaysOnTop={false}
					Enabled={true}
					MaxDistance={100}
					ExtentsOffsetWorldSpace={new Vector3(0, height + 2.25, 0)}
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
