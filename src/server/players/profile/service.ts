import { Events } from "server/network";
import { Service } from "@flamework/core";
import { store } from "server/state/store";
import type { OnStart } from "@flamework/core";

@Service({})
export class ProfileService implements OnStart {
	public onStart(): void {
		Events.profile.adjustSetting.connect((player, setting, value) => {
			const { Name } = player;
			store.profileAdjustSetting({ setting, value }, { user: Name, replicate: true });
			warn(`[Service] Setting ${setting} for ${Name} to ${value}`);
		});
	}
}
