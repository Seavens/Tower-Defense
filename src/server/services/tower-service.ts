import { Functions } from "server/network";
import { Service } from "@flamework/core";
import type { OnStart } from "@flamework/core";
import type { TowerId } from "shared/types/ids";

@Service({})
export class TowerService implements OnStart {
	public onStart(): void {
		Functions.requestPlaceTower.setCallback((player: Player, id: TowerId, cframe: CFrame): boolean => {
			// !! Temporary.
			return true;
		});
	}
}
