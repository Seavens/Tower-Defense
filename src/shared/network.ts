import { Networking } from "@flamework/networking";
import type { BroadcastAction } from "@rbxts/reflex";
import type { DamageKind } from "./types/kinds";
import type { StatusId, TargetId, TowerId } from "./types/ids";

interface ClientToServerEvents {
	replicateReady(): void;

	replicatePlaceTower(uuid: string, position: Vector3): void;
	replicateTowerTargeting(key: string, targeting: TargetId): void;
}

interface ServerToClientEvents {
	replicateTowerTarget: Networking.Unreliable<(tower: string, target?: number) => void>;
	replicateMobResync: Networking.Unreliable<(first: Vector2int16, second: Vector2int16) => void>;

	replicateDataLoaded(): void;

	replicateHydration(state: defined): void;
	replicateActions(actions: Array<BroadcastAction>): void;

	replicateCharacterAdded(user: string, rig: Model): void;
	replicateCharacterRemoved(user: string): void;

	replicateMobDamage(data: Vector2int16, kind: DamageKind): void;
	replicateMobDeath(index: number): void;
	replicateMobStatusAdded(data: Vector2int16, status: StatusId, timestamp: number): void;
	replicateMobStatusRemoved(index: number, status: StatusId): void;

	replicateIndexReset(index: number): void;

	replicateTowerPlacement(uuid: string, id: TowerId, position: Vector3): void;
}

interface ClientToServerFunctions {
	requestResetCharacter(): void;
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
