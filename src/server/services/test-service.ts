import { $print } from "rbxts-transform-debug";
import { GenerateTowerObject } from "shared/functions/tower-functions";
import { Service } from "@flamework/core";
import { serverProducer } from "server/state/producer";
import type { Entity } from "server/classes/entity";
import type { EntityMetadata, ReplicationMetadata } from "shared/state/metadata";
import type { OnDataLoaded } from "./data-service";

@Service({})
export class TestService implements OnDataLoaded {
	public onDataLoaded(entity: Entity): void {
		// task.wait(3);
		// for (const i of $range(1, 6)) {
		// 	const item = GenerateTowerObject(entity.id);
		// 	const slot = `${i}`;
		// 	const metadata: EntityMetadata & ReplicationMetadata = { user: entity.user, replicate: true };
		// 	serverProducer.inventoryAddItem({ item, slot }, metadata);
		// 	task.wait();
		// 	serverProducer.inventoryEquipItem({ item, slot }, metadata);
		// 	task.wait();
		// 	$print(serverProducer.getState());
		// }
	}
}
