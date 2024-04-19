import { Controller } from "@flamework/core";
import { KeybindController } from "client/players/profile/settings";
import { SettingId } from "shared/players/settings";
import { StarterGui } from "@rbxts/services";
import { UIKind } from "client/ui/types";
import { selectOpenUI } from "client/ui/selectors";
import { store } from "client/state/store";
import type { OnStart } from "@flamework/core";

@Controller({})
export class InventoryController implements OnStart {
	public onStart(): void {
		// ContextActionService.BindAction(
		// 	"inventory-open",
		// 	(_: string, state: Enum.UserInputState): void => {
		// 		if (state !== Enum.UserInputState.Begin) {
		// 			return;
		// 		}
		// 		const open = store.getState(selectOpenUI);
		// 		if (open === UIKind.Inventory) {
		// 			store.closeUI({ kind: UIKind.Inventory });
		// 			return;
		// 		}
		// 		store.openUI({ kind: UIKind.Inventory });
		// 	},
		// 	false,
		// 	Enum.KeyCode.Tab,
		// );
		KeybindController.connectKeybind(SettingId.ToggleInventory, (state: Enum.UserInputState): void => {
			if (state !== Enum.UserInputState.Begin) {
				return;
			}
			const open = store.getState(selectOpenUI);
			if (open === UIKind.Inventory) {
				store.closeUI({ kind: UIKind.Inventory });
				return;
			}
			store.openUI({ kind: UIKind.Inventory });
		});
		KeybindController.connectKeybind(SettingId.SlotOne, (state: Enum.UserInputState): void => {
			if (state !== Enum.UserInputState.Begin) {
				return;
			}
			warn("balls!");
		});
		StarterGui.SetCoreGuiEnabled("PlayerList", false);
	}
}
