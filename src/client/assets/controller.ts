import { ASSET_IDS } from "shared/assets/constants";
import { ContentProvider, ReplicatedStorage } from "@rbxts/services";
import { Controller } from "@flamework/core";
import type { OnStart } from "@flamework/core";
import type { t } from "@rbxts/t";

const { assets } = ReplicatedStorage;

type AssetFolders = Omit<typeof assets, keyof Folder>;

@Controller({})
export class AssetController implements OnStart {
	public static getAsset<T extends Instance = Instance>(
		folder: keyof AssetFolders,
		name: string,
		guard?: t.check<T>,
	): Option<T> {
		const subfolder = assets[folder];
		const asset = subfolder.FindFirstChild(name);
		if (asset === undefined || !guard?.(asset)) {
			warn(name, "in", folder, "does not exist or fails the guard.");
			return undefined;
		}
		return asset;
	}

	public onStart(): void {
		const ids = new Array<RBXAssetId>();
		for (const [, id] of pairs(ASSET_IDS)) {
			ids.push(id);
		}
		const instances = assets.GetDescendants();
		ContentProvider.PreloadAsync([...ids, ...instances], (content: string, status: Enum.AssetFetchStatus): void => {
			//
		});
	}
}
