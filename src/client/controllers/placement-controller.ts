import { Collision, Tag } from "shared/types/enums";
import { Controller } from "@flamework/core";
import { ReplicatedStorage, UserInputService, Workspace } from "@rbxts/services";
import { clientProducer } from "client/state/producer";
import { reuseThread } from "shared/functions/reuse-thread";
import { selectCurrentMap } from "shared/state/selectors";
import { selectPlacing } from "client/state/selectors";
import { setCollision } from "shared/functions/set-collision";
import type { MapId } from "shared/types/ids";
import type { OnStart, OnTick } from "@flamework/core";

const { assets } = ReplicatedStorage;
const { towers } = assets;
const { placed, debris, characters, mobs, map } = Workspace;
const camera = Workspace.CurrentCamera;

const params = new RaycastParams();
params.AddToFilter([placed, debris, characters, mobs]);
params.FilterType = Enum.RaycastFilterType.Exclude;

type PlacementCallback = (placing: string, asset: Model) => void;

@Controller({})
export class PlacementController implements OnStart, OnTick {
	protected static listeners = new Set<PlacementCallback>();

	protected cframe = CFrame.identity;
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

	public isValidCFrame(cframe: CFrame): boolean {
		const { placeable } = this;
		if (placeable === undefined) {
			return false;
		}
		// !! Bug.
		const origin = cframe.Position.mul(Vector3.yAxis.mul(5));
		const direction = Vector3.yAxis.mul(-15);
		const raycast = Workspace.Raycast(origin, direction, placeable);
		if (raycast === undefined) {
			return false;
		}
		const instance = raycast.Instance;
		if (!instance.HasTag(Tag.Placeable)) {
			return false;
		}
		return true;
	}

	public getAsset(name: string, ghostify?: boolean): Option<Model> {
		const asset = towers.FindFirstChild(name);
		if (asset === undefined || !asset.IsA("Model")) {
			return undefined;
		}
		const cloned = asset.Clone();
		if (ghostify === true) {
			for (const instance of cloned.GetDescendants()) {
				if (!instance.IsA("BasePart")) {
					continue;
				}
				instance.Material = Enum.Material.ForceField;
				instance.BrickColor = new BrickColor("Lime green");
			}
		}
		cloned.Parent = debris;
		setCollision(cloned, Collision.Tower, true);
		return cloned;
	}

	public getCFrame(): CFrame {
		if (camera === undefined) {
			return CFrame.identity;
		}
		const location = UserInputService.GetMouseLocation();
		const ray = camera.ViewportPointToRay(location.X, location.Y);
		const origin = ray.Origin;
		const direction = ray.Direction.mul(100);
		const raycast = Workspace.Raycast(origin, direction, params);
		if (raycast === undefined) {
			return new CFrame(origin.add(direction));
		}
		const position = raycast.Position;
		return new CFrame(position);
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
				this.getAsset(prefab.Name, false);
				prefab.Destroy();
				this.prefab = undefined;
				this.previous = undefined;
			}
			return;
		}
		const { placing, previous, valid: wasValid } = this;
		let { prefab, cframe: last } = this;
		if (prefab === undefined || placing !== previous) {
			prefab?.Destroy();
			prefab = this.getAsset(placing, true);
			last = this.getCFrame();
			this.prefab = prefab;
			this.previous = placing;
		}
		const cframe = this.getCFrame();
		const interpolated = last.Lerp(cframe, 0.25);
		// !! It's likely more ideal to check if the cframe is valid here rather than
		// !! another function calling raycast, just for now though, it's like this.
		const valid = this.isValidCFrame(interpolated);
		if (wasValid !== valid) {
			this.valid = valid;
			if (valid) {
				this.setAssetColor(new Color3(0, 1, 0));
			} else {
				this.setAssetColor(new Color3(1, 0, 0));
			}
		}
		prefab?.PivotTo(interpolated);
		this.cframe = interpolated;
	}

	public onStart(): void {
		clientProducer.subscribe(selectPlacing, (placing: Option<string>): void => {
			this.placing = placing;
		});
		clientProducer.subscribe(selectCurrentMap, (id: Option<MapId>): void => {
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
