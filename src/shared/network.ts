import { Networking } from "@flamework/networking";
import type { BroadcastAction } from "@rbxts/reflex";
import type { MobDamage, MobStatus } from "./mobs/types";
import type { TowerId, TowerTargeting } from "./tower/types";

interface ClientToServerEvents {
	replicateReady(): void;

	replicatePlaceTower(uuid: string, position: Vector3): void;
	replicateTowerTargeting(key: string, targeting: TowerTargeting): void;
}

interface ServerToClientEvents {
	replicateTowerTarget: Networking.Unreliable<(tower: string, target?: number) => void>;
	replicateMobResync: Networking.Unreliable<(first: Vector2int16, second: Vector2int16) => void>;

	replicateDataLoaded(): void;

	replicateHydration(state: defined): void;
	replicateActions(actions: Array<BroadcastAction>): void;

	replicateCharacterAdded(user: string, rig: Model): void;
	replicateCharacterRemoved(user: string): void;

	replicateMobDamage(data: Vector2int16, kind: MobDamage): void;
	replicateMobDeath(index: number): void;
	replicateMobStatusAdded(data: Vector2int16, status: MobStatus, timestamp: number): void;
	replicateMobStatusRemoved(index: number, status: MobStatus): void;

	replicateIndexReset(index: number): void;

	replicateTowerPlacement(uuid: string, id: TowerId, position: Vector3): void;
}

interface ClientToServerFunctions {
	requestResetCharacter(): void;
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
