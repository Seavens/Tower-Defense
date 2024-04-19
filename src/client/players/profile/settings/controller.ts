import { ContextActionService } from "@rbxts/services";
import { Controller, Flamework } from "@flamework/core";
import { SettingId } from "shared/players/settings";
import { UIKind } from "client/ui/types";
import { isKeycode } from "shared/utility/guards";
import { reuseThread } from "shared/utility/functions/reuse-thread";
import { selectOpenUI } from "client/ui/selectors";
import { selectSettingValues } from "./selectors";
import { store } from "client/state/store";
import type { OnStart } from "@flamework/core";
import type { SettingIdOfKind, SettingKind, SettingValueOfId } from "shared/players/settings";

type KeybindId = SettingIdOfKind<SettingKind.Keybind>;
type KeybindCallback = (state: Enum.UserInputState) => void;

const isKeybindId = Flamework.createGuard<KeybindId>();

@Controller({})
export class KeybindController implements OnStart {
	protected static readonly callbacks = new Map<KeybindId, Array<KeybindCallback>>();

	public static connectKeybind(keybind: KeybindId, callback: KeybindCallback): () => void {
		const { callbacks } = this;
		let listeners = callbacks.get(keybind);
		if (listeners === undefined) {
			listeners = new Array<KeybindCallback>();
			callbacks.set(keybind, listeners);
		}
		listeners.push(callback);
		return (): void => {
			const index = listeners.indexOf(callback);
			listeners.remove(index);
		};
	}

	public bindKeybind(keybind: KeybindId, key: Keycode): void {
		ContextActionService.BindAction(
			keybind,
			(_, state: Enum.UserInputState): void => this.activateKeybind(keybind, state),
			false,
			Enum.KeyCode[key],
		);
	}

	public unbindKeybind(keybind: KeybindId): void {
		ContextActionService.UnbindAction(keybind);
	}

	public activateKeybind(keybind: KeybindId, state: Enum.UserInputState): void {
		const { callbacks } = KeybindController;
		const listeners = callbacks.get(keybind);
		if (listeners === undefined) {
			return;
		}
		for (const listener of listeners) {
			reuseThread((): void => listener(state));
		}
	}

	public remapKeybind(keybind: KeybindId, key: Keycode): void {
		this.unbindKeybind(keybind);
		this.bindKeybind(keybind, key);
	}

	public onStart(): void {
		store.observe(
			selectSettingValues,
			(key: SettingValueOfId<SettingId>, keybind: SettingId): defined => `${key}_${keybind}`,
			(key: SettingValueOfId<SettingId>, keybind: SettingId): void => {
				warn(key, keybind);
				if (!isKeycode(key) || !isKeybindId(keybind)) {
					return;
				}
				this.remapKeybind(keybind, key);
			},
		);
		KeybindController.connectKeybind(SettingId.ToggleSettings, (state: Enum.UserInputState): void => {
			if (state !== Enum.UserInputState.Begin) {
				return;
			}
			const open = store.getState(selectOpenUI);
			if (open === UIKind.Settings) {
				store.closeUI({ kind: UIKind.Settings });
				return;
			}
			store.openUI({ kind: UIKind.Settings });
		});
	}
}
