import { useProducer } from "@rbxts/react-reflex";
import type { ClientStore } from "client/state/store";
import type { UseProducerHook } from "@rbxts/react-reflex";

export const useStore: UseProducerHook<ClientStore> = useProducer;
