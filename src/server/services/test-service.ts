import { $print } from "rbxts-transform-debug";
import { GenerateTowerObject } from "shared/functions/tower-functions";
import { Players } from "@rbxts/services";
import { Service } from "@flamework/core";
import { serverProducer } from "server/state/producer";
import type { Entity } from "server/classes/entity";
import type { OnPlayerAdded } from "./player-service";

@Service({})
export class TestService implements OnPlayerAdded {
	public onPlayerAdded(player: Entity): void {
		task.wait(5);
		for (let i = 1; i <= 6; i = i + 1) {
			warn("Adding item to slot " + i);
			const tower = GenerateTowerObject(player.id);
			serverProducer.inventoryEquipItem({ item: tower, slot: `${i}` }, { user: player.user, replicate: true });
		}
	}
}
