import { GenerateTower } from "shared/functions/tower-functions";
import { RarityId } from "shared/types/ids/rarity-id";
import { Service } from "@flamework/core";
import { TowerDefinitions } from "shared/definitions/towers";
import { selectCurrentMap } from "shared/state/selectors";
import { serverProducer } from "server/state/producer";
import type { Entity } from "server/classes/entity";
import type { OnPlayerAdded } from "./player-service";

@Service({})
export class TestService implements OnPlayerAdded {
	public onPlayerAdded(player: Entity): void {
		const map = serverProducer.getState(selectCurrentMap);
		warn(map);

		//         task.wait(2);

		//         let rare = 0;
		//         let epic = 0;
		//         let legendary = 0;
		//         let mythical = 0;

		//         const runs = 10000;

		//         for (let i = 0; i < runs; i++) {
		//             const rarity = TowerDefinitions[GenerateTower(player.id).id].rarity;
		//             if (rarity === RarityId.Rare) {
		//                 rare++;
		//             }
		//             else if (rarity === RarityId.Epic) {
		//                 epic++;
		//             }
		//             else if (rarity === RarityId.Legendary) {
		//                 legendary++;
		//             }
		//             else if (rarity === RarityId.Mythical) {
		//                 mythical++;
		//             }
		//         }

		//         warn(`

		//         Rare: ${rare}: ${rare/runs*100}%,
		//         Epic: ${epic}: ${epic/runs*100}%,
		//         Legendary: ${legendary}: ${legendary/runs*100}%,
		//         Mythical: ${mythical}: ${mythical/runs*100}%
		// ;
		//         `);
	}
}
