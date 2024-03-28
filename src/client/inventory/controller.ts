import { Controller } from "@flamework/core";
import { StarterGui } from "@rbxts/services";
import type { OnStart } from "@flamework/core";

@Controller({})
export class InventoryController implements OnStart {
	public onStart(): void {
		StarterGui.SetCoreGuiEnabled("PlayerList", false);
	}
}
