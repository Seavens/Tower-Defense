import { ContextActionService, StarterGui } from "@rbxts/services";
import { Controller } from "@flamework/core";
import { UIKind } from "client/ui/types";
import { selectOpenUI } from "client/ui/selectors";
import { store } from "client/state/store";
import type { OnStart } from "@flamework/core";

@Controller({})
export class InventoryController implements OnStart {
	public onStart(): void {
		ContextActionService.BindAction(
			"inventory-open",
			(_: string, state: Enum.UserInputState): void => {
				if (state !== Enum.UserInputState.Begin) {
					return;
				}
				const open = store.getState(selectOpenUI);
				if (open === UIKind.Inventory) {
					store.closeUI({ kind: UIKind.Inventory });
					return;
				}
				store.openUI({ kind: UIKind.Inventory });
			},
			false,
			Enum.KeyCode.Tab,
		);
		StarterGui.SetCoreGuiEnabled("PlayerList", false);
	}
}
