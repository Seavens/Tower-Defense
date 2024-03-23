import { Tower as API } from "shared/api/tower";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import type { TowerId } from "shared/types/ids";
import type { TowerStats } from "shared/api/tower";

const { assets } = ReplicatedStorage;
const { towers } = assets;
const { placed } = Workspace;

export class Tower extends API {
	public readonly instance: Model;

	public constructor(id: TowerId, uuid: string, cframe: CFrame, stats?: TowerStats) {
		super(id, uuid, cframe);
		const model = towers.FindFirstChild(id);
		if (model === undefined || !model.IsA("Model")) {
			// !! Handle this error?
			throw "raaah";
		}
		const instance = model.Clone();
		instance.PivotTo(cframe);
		instance.Parent = placed;
		this.instance = instance;
	}

	public attack(): void {}
	public targeting(): void {}
	public sell(): void {}
	public upgrade(): void {}
}
