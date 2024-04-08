import { Mob } from "client/mob/class";
import { MobBillboard } from "./billboard";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";

const billboards = useMemo((): Array<Element> => {
	const mobCount = Mob.getMobCount();
	const billboards = new Array<Element>(mobCount);
	for (const [uuid, mob] of Mob.getMobs()) {
		// billboards.push(<MobBillboard mobId={} currentHealth={mob.heal} />);
	}
	return billboards;
}, [Mob.getMobCount()]);

export function MobApp(): Element {
	return <>{billboards}</>;
}
