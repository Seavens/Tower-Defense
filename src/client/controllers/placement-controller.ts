import { Collision } from "shared/types/enums";
import { Controller } from "@flamework/core";
import { ReplicatedStorage, UserInputService, Workspace } from "@rbxts/services";
import { clientProducer } from "client/state/producer";
import { reuseThread } from "shared/functions/reuse-thread";
import { selectPlacing } from "client/state/selectors";
import { setCollision } from "shared/functions/set-collision";
import type { OnStart, OnTick } from "@flamework/core";

const { assets } = ReplicatedStorage;
const { towers } = Workspace;
const camera = Workspace.CurrentCamera;

const params = new RaycastParams();
params.AddToFilter(towers);
params.FilterType = Enum.RaycastFilterType.Exclude;

type PlacementCallback = (placing: string, asset: Model) => void;

@Controller({})
export class PlacementController implements OnStart, OnTick {
	protected static listeners = new Set<PlacementCallback>();

	protected cframe = CFrame.identity;
	protected placing: Option<string>;
	protected prefab: Option<Model>;
	protected previous: Option<string>;

	public static onPlaced(callback: PlacementCallback): void {
		const { listeners } = this;
		listeners.add(callback);
	}

	public isPlacing(): this is PlacementController & { placing: string } {
		const { placing } = this;
		return placing !== undefined;
	}

	public getAsset(name: string): Option<Model> {
		const asset = assets.FindFirstChild(name);
		if (asset === undefined || !asset.IsA("Model")) {
			return undefined;
		}
		const cloned = asset.Clone();
		cloned.Parent = towers;
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

	public onTick(dt: number): void {
		if (!this.isPlacing()) {
			const { prefab } = this;
			if (prefab !== undefined) {
				prefab.Destroy();
				this.prefab = undefined;
				this.previous = undefined;
			}
			return;
		}
		const { placing, previous } = this;
		let { prefab, cframe: last } = this;
		if (prefab === undefined || placing !== previous) {
			prefab?.Destroy();
			prefab = this.getAsset(placing);
			last = this.getCFrame();
			this.prefab = prefab;
			this.previous = placing;
		}
		const cframe = this.getCFrame();
		const interpolated = last.Lerp(cframe, 0.25);
		prefab?.PivotTo(interpolated);
		this.cframe = interpolated;
	}

	public onStart(): void {
		clientProducer.subscribe(selectPlacing, (placing: Option<string>): void => {
			this.placing = placing;
		});
		UserInputService.InputBegan.Connect((input: InputObject, processed: boolean): void => {
			if (processed) {
				return;
			}
			const inputType = input.UserInputType;
			const { placing, prefab } = this;
			if (prefab === undefined || placing === undefined || inputType !== Enum.UserInputType.MouseButton1) {
				return;
			}
			const { listeners } = PlacementController;
			for (const listener of listeners) {
				reuseThread((): void => listener(placing, prefab));
			}
		});
	}
}