import { GenerateTowerObject } from "shared/functions/tower-functions";
import { Service } from "@flamework/core";
import { serverProducer } from "server/state/producer";
import type { Entity } from "server/classes/entity";
import type { EntityMetadata, ReplicationMetadata } from "shared/state/metadata";
import type { OnDataLoaded } from "./data-service";

@Service({})
export class TestService implements OnDataLoaded {
	public async onDataLoaded(entity: Entity): Promise<void> {
		await entity.getData();
		for (const index of $range(1, 6)) {
			const chance = math.random() > 0.5;
			if (chance) {
				continue;
			}
			const { user, id } = entity;
			const slot = `${index}`;
			const item = GenerateTowerObject(id);
			const metadata: EntityMetadata & ReplicationMetadata = { user, replicate: true };
			// serverProducer.inventoryAddItem({ item, slot }, metadata);
			// task.wait();
			// serverProducer.inventoryEquipItem({ item, slot }, metadata);
		}
	}
}
