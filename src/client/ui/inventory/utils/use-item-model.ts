import { ReplicatedStorage } from "@rbxts/services";
import { useMemo } from "@rbxts/react";
import type { ItemId } from "shared/inventory/types";

const { assets } = ReplicatedStorage;
const { items } = assets;

export function useItemModel(id: ItemId): Option<Model> {
	const model = useMemo((): Option<Model> => {
		const model = items.FindFirstChild(id);
		if (model === undefined || !model.IsA("Model")) {
			return undefined;
		}
		return model.Clone();
	}, [id]);
	return model;
}
