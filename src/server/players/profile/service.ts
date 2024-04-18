import { Events } from "server/network";
import { Service } from "@flamework/core";
import { store } from "server/state/store";
import type { OnStart } from "@flamework/core";

@Service({})
export class ProfileService implements OnStart {
	public onStart(): void {
		Events.profile.settings.enableVFX.connect((player: Player, enable: boolean): void => {
			const user = player.Name;
			store.profileAdjustVfx({ vfxEnabled: enable }, { user, replicate: true });
		});
		Events.profile.settings.enableMobBillboards.connect((player: Player, enable: boolean): void => {
			const user = player.Name;
			store.profileAdjustVfx({ mobBillboards: enable }, { user, replicate: true });
		});
		Events.profile.settings.enableTowerBillboards.connect((player: Player, enable: boolean): void => {
			const user = player.Name;
			store.profileAdjustVfx({ towerBillboards: enable }, { user, replicate: true });
		});
		Events.profile.settings.enableMusic.connect((player: Player, enable: boolean): void => {
			const user = player.Name;
			store.profileAdjustMusic({ musicEnabled: enable }, { user, replicate: true });
		});
		Events.profile.settings.enableSFX.connect((player: Player, enable: boolean): void => {
			const user = player.Name;
			store.profileAdjustSfx({ sfxEnabled: enable }, { user, replicate: true });
		});
	}
}
