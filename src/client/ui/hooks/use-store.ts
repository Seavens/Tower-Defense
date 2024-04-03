import type { UseProducerHook } from "@rbxts/react-reflex";
import { useProducer } from "@rbxts/react-reflex";
import type { ClientStore } from "client/state/store";

export const useStore: UseProducerHook<ClientStore> = useProducer;
