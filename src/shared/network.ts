import { Networking } from "@flamework/networking";
import type { BroadcastAction } from "@rbxts/reflex";
import type { DamageKind } from "./types/kinds";
import type { StatusId } from "./types/ids";

interface ClientToServerEvents {
	replicateReady(): void;
}

interface ServerToClientEvents {
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
}

interface ClientToServerFunctions {
	requestResetCharacter(): void;
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();