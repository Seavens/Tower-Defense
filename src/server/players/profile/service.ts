import { Events } from "server/network";
import { Service } from "@flamework/core";
import { store } from "server/state/store";
import type { OnStart } from "@flamework/core";

@Service({})
export class ProfileService implements OnStart {
	public onStart(): void {}
}
