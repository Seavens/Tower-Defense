import { Networking } from "@flamework/networking";
import type { BroadcastAction } from "@rbxts/reflex";
import type { MobDamage, MobStatus } from "./mobs/types";
import type { TowerItemId } from "./inventory/types";
import type { TowerTargeting } from "./tower/types";

interface ClientToServerEvents {
	state: {
		ready(): void;
	};

	tower: {
		place(uuid: string, position: Vector3): void;
		targeting(key: string, targeting: TowerTargeting): void;
	};
}

interface ServerToClientEvents {

	state: {
		hydrate(state: defined): void;
		actions(actions: Array<BroadcastAction>): void;
	};
	
	player: {
		loaded: Networking.Unreliable<() => void>;
	
	}
	
	character: {
		add(user: string, rig: Model): void;
		remove(user: string): void;
	};

	tower: {
		target: Networking.Unreliable<(key: string, target?: number) => void>;
		place: Networking.Unreliable<(uuid: string, position: Vector3) => void>;
	};

	mob: {
		resync: Networking.Unreliable<(first: Vector2int16, second: Vector2int16) => void>;
		damage: Networking.Unreliable<(data: Vector2int16, kind: MobDamage) => void>;
		death: Networking.Unreliable<(index: number) => void>;
		statusAdded: Networking.Unreliable<(data: Vector2int16, status: MobStatus, timestamp: number) => void>;
		statusRemoved: Networking.Unreliable<(index: number, status: MobStatus) => void>;
		indexReset: Networking.Unreliable<(index: number) => void>;
	}

	
}

interface ClientToServerFunctions {
	character: {
		requestReset(): void;
	};
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
