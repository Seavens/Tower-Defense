import { Collision, setCollision } from "shared/utility/collision";
import { ComponentTag } from "shared/utility/components/types";
import { Controller } from "@flamework/core";
import { ReplicatedStorage, UserInputService, Workspace } from "@rbxts/services";
import { getMouseCFrame } from "client/utility/get-mouse-cframe";
import { reuseThread } from "shared/utility/functions/reuse-thread";
import { selectCurrentMap } from "shared/game/selectors";
import { selectPlacing } from "./selectors";
import { store } from "client/state/store";
import type { MapId } from "shared/game/map/types";
import type { OnStart, OnTick } from "@flamework/core";

const { assets } = ReplicatedStorage;
const { towers } = assets;
const { placed, debris, characters, mobs, map } = Workspace;

const params = new RaycastParams();
params.AddToFilter([placed, debris, characters, mobs]);
params.FilterType = Enum.RaycastFilterType.Exclude;

type PlacementCallback = (placing: string, asset: Model) => void;

@Controller({})
export class PlacementController implements OnStart, OnTick {
	protected static listeners = new Set<PlacementCallback>();

	protected position = Vector3.zero;
	protected placing: Option<string>;
	protected prefab: Option<Model>;
	protected previous: Option<string>;

	protected placeable: Option<RaycastParams>;
	protected map: Option<MapId>;
	protected valid = false;

	public static onPlaced(callback: PlacementCallback): void {
		const { listeners } = this;
		listeners.add(callback);
	}

	public isPlacing(): this is PlacementController & { placing: string } {
		const { placing } = this;
		return placing !== undefined;
	}

	public isValidPosition(position: Vector3): boolean {
		const { placeable } = this;

		if (placeable === undefined) {
			return false;
		}
		const origin = position.add(Vector3.yAxis.mul(5));
		const direction = Vector3.yAxis.mul(-15);
		const raycast = Workspace.Raycast(origin, direction, placeable);

		if (raycast === undefined) {
			return false;
		}

		const instance = raycast.Instance;
		if (!instance.HasTag(ComponentTag.Placeable)) {
			return false;
		}
		return true;
	}

	public getPosition(model: Option<Model>): Vector3 {
		const { placeable } = this;
		if (model === undefined) {
			return Vector3.zero;
		}
		const mouse = getMouseCFrame(params);
		const size = model.GetExtentsSize().div(2);
		const position = mouse.PointToWorldSpace(size);
		const origin = position.add(Vector3.yAxis.mul(5));
		const direction = Vector3.yAxis.mul(-15);
		const raycast = Workspace.Raycast(origin, direction, placeable);
		if (raycast === undefined) {
			return position;
		}
		return raycast.Position.add(Vector3.yAxis.mul(size.Y));
	}

	public getAsset(name: string, ghost = true): Option<Model> {
		const asset = towers.FindFirstChild(name);
		if (asset === undefined || !asset.IsA("Model")) {
			return undefined;
		}
		const cloned = asset.Clone();
		if (ghost) {
			const position = this.getPosition(cloned);
			const valid = this.isValidPosition(position);
			for (const instance of cloned.GetDescendants()) {
				if (!instance.IsA("BasePart")) {
					continue;
				}
				instance.Material = Enum.Material.ForceField;
				instance.Color = new Color3(valid ? 0 : 1, valid ? 1 : 0, 0);
			}
		}
		cloned.Parent = debris;
		setCollision(cloned, Collision.Tower, true);
		return cloned;
	}

	public setAssetColor(color: Color3): void {
		const { prefab } = this;
		if (prefab === undefined) {
			return;
		}
		for (const instance of prefab.GetDescendants()) {
			if (!instance.IsA("BasePart")) {
				continue;
			}
			instance.Color = color;
		}
	}

	public onTick(dt: number): void {
		if (!this.isPlacing()) {
			const { prefab } = this;
			if (prefab !== undefined) {
				prefab.Destroy();
				this.prefab = undefined;
				this.previous = undefined;
				this.valid = false;
			}
			return;
		}
		const { placing, previous, valid: wasValid } = this;
		let { prefab, position: last } = this;
		if (prefab === undefined || placing !== previous) {
			prefab?.Destroy();
			prefab = this.getAsset(placing, true);
			last = this.getPosition(prefab);
			this.prefab = prefab;
			this.previous = placing;
		}
		const position = this.getPosition(prefab);
		const interpolated = last.Lerp(position, 0.25);
		// !! It's likely more ideal to check if the cframe is valid here rather than
		// !! another function calling raycast, just for now though, it's like this.
		const valid = this.isValidPosition(interpolated);
		if (wasValid !== valid) {
			this.valid = valid;
			if (valid) {
				this.setAssetColor(new Color3(0, 1, 0));
			} else {
				this.setAssetColor(new Color3(1, 0, 0));
			}
		}
		prefab?.PivotTo(new CFrame(interpolated));
		this.position = interpolated;
	}

	public onStart(): void {
		store.subscribe(selectPlacing, (placing: Option<string>): void => {
			this.placing = placing;
		});
		store.subscribe(selectCurrentMap, (id: Option<MapId>): void => {
			if (id === undefined) {
				return;
			}
			const { placeable } = map;
			const params = new RaycastParams();
			params.AddToFilter(placeable);
			params.FilterType = Enum.RaycastFilterType.Include;
			this.placeable = params;
			this.map = id;
		});
		UserInputService.InputBegan.Connect((input: InputObject, processed: boolean): void => {
			if (processed) {
				return;
			}
			const inputType = input.UserInputType;
			const inputState = input.UserInputState;
			const { placing, prefab, valid } = this;
			if (
				prefab === undefined ||
				placing === undefined ||
				inputType !== Enum.UserInputType.MouseButton1 ||
				inputState !== Enum.UserInputState.Begin ||
				!valid
			) {
				return;
			}
			// check that current {cframe/raycast hit instance} is placeable
			const { listeners } = PlacementController;
			for (const listener of listeners) {
				reuseThread((): void => listener(placing, prefab));
			}
		});
	}
}
