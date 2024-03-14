import { Service } from "@flamework/core";
import type { Entity } from "server/classes/entity";
import type { OnPlayerAdded } from "./player-service";

@Service({})
export class TestService implements OnPlayerAdded {
	public onPlayerAdded(player: Entity): void {}
}
