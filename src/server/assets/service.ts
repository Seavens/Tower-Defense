import { ASSET_IDS } from "shared/assets/constants";
import { ContentProvider, ReplicatedStorage } from "@rbxts/services";
import { Service } from "@flamework/core";
import type { OnStart } from "@flamework/core";

const { assets } = ReplicatedStorage;

@Service({})
export class AssetService implements OnStart {
	public onStart(): void {
		const ids = new Array<RBXAssetId>();
		for (const [, id] of pairs(ASSET_IDS)) {
			ids.push(id);
		}
		const instances = assets.GetDescendants();
		ContentProvider.PreloadAsync(
			[...ids, ...instances],
			(content: string, status: Enum.AssetFetchStatus): void => {},
			//
		);
	}
}
