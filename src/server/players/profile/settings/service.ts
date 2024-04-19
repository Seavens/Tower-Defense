import { Events } from "server/network";
import { Service } from "@flamework/core";
import { settingDefinitions } from "shared/players/settings";
import { store } from "server/state/store";
import type { OnStart } from "@flamework/core";
import type { SettingId } from "shared/players/settings";

@Service({})
export class SettingsService implements OnStart {
	public onSet<I extends SettingId>(player: Player, id: I, value: defined): void {
		const { kind } = settingDefinitions[id];
		const { guard } = kind;
		if (!guard(value)) {
			return;
		}
		const user = player.Name;
		store.setSetting({ id, value }, { user, broadcast: true });
	}

	public onReset(player: Player, id: SettingId): void {
		const user = player.Name;
		store.resetSetting({ id }, { user, broadcast: true });
	}

	public onStart(): void {
		Events.settings.set.connect((player: Player, id: SettingId, value: defined): void =>
			this.onSet(player, id, value),
		);
		Events.settings.reset.connect((player: Player, id: SettingId): void => this.onReset(player, id));
	}
}
