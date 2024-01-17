import { Networking } from "@flamework/networking";
import type { BroadcastAction } from "@rbxts/reflex";

interface ClientToServerEvents {
	replicateReady(): void;
}

interface ServerToClientEvents {
	replicateDataLoaded(): void;

	replicateHydration(state: defined): void;
	replicateActions(actions: Array<BroadcastAction>): void;

	replicateCharacterAdded(user: string, rig: Model): void;
	replicateCharacterRemoved(user: string): void;
}

interface ClientToServerFunctions {
	requestResetCharacter(): void;
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
