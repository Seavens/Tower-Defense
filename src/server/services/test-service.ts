import { GenerateTower } from "shared/functions/tower-functions";
import { Service } from "@flamework/core";
import { serverProducer } from "server/state/producer";
import type { Entity } from "server/classes/entity";
import type { InventoryAddItem } from "shared/state/actions";
import type { OnPlayerAdded } from "./player-service";

@Service({})
export class TestService implements OnPlayerAdded {
	public onPlayerAdded(player: Entity): void {}
}
