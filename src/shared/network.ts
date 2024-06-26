import { Networking } from "@flamework/networking";
import type { BroadcastAction } from "@rbxts/reflex";
import type { MobDamage, MobData, MobId } from "./mob/types";
import type { SettingId } from "./players/settings";
import type { TowerAbility } from "./inventory/towers/abilities/types";
import type { TowerTargeting } from "./tower/types";

interface ClientToServerEvents {
	state: {
		ready(): void;
	};

	tower: {
		place(uuid: string, position: Vector3): void;
		targeting(key: string, targeting: TowerTargeting): void;
		upgrade(key: string): void;
		sell(key: string): void;
		ability(key: string, ability: TowerAbility): void;
	};

	inventory: {
		lock(slot: string): void;
		equip(slot: string): void;
		unequip(slot: string): void;
		sell(slot: string): void;
	};

	settings: {
		set<I extends SettingId>(id: I, value: defined): void;
		reset(id: SettingId): void;
	};
}

interface ServerToClientEvents {
	state: {
		hydrate(state: defined): void;
		actions(actions: Array<BroadcastAction>): void;
	};

	player: {
		loaded: Networking.Unreliable<() => void>;
	};

	character: {
		add(user: string, rig: Model): void;
		remove(user: string): void;
	};

	tower: {
		place: Networking.Unreliable<(uuid: UUID, position: Vector3) => void>;
		attack(key: string, target?: UUID): void;
		ability(key: string, ability: TowerAbility, target?: UUID): void;
	};

	mob: {
		resync: Networking.Unreliable<(uuid: UUID, current: number, alpha: number, timestamp: number) => void>;
		damage: Networking.Unreliable<(uuid: UUID, damage: number, kind: MobDamage) => void>;
		death: Networking.Unreliable<(uuid: UUID) => void>;
		spawned(id: MobId, uuid: UUID, timestamp: number): void;
		sync(data: Map<UUID, MobData>): void;
	};
}

interface ClientToServerFunctions {
	character: {
		requestReset(): void;
	};
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
