import { CollectionService, ContextActionService, Players, UserInputService, Workspace } from "@rbxts/services";
import { ComponentTag } from "shared/components/types";
import { Controller } from "@flamework/core";
import { Events } from "client/network";
import { Mob } from "client/mob/class";
import { PlacementController } from "client/placement/controller";
import { TOWER_KEY_ATTRIBUTE } from "./constants";
import { Tower } from "client/tower/class";
import { getUser } from "shared/player/utility";
import { selectInventoryData } from "client/inventory/selectors";
import { selectPlacedTowers } from "shared/tower/selectors";
import { selectPlacementState } from "client/placement/selectors";
import { selectSelectedTower } from "./selectors";
import { store } from "client/state/store";
import type { OnStart } from "@flamework/core";
import type { ReplicatedTower } from "shared/tower/types";

const { placed } = Workspace;

const player = Players.LocalPlayer;
const camera = Workspace.CurrentCamera;

const params = new RaycastParams();
params.AddToFilter([placed]);
params.FilterType = Enum.RaycastFilterType.Include;

@Controller({})
export class TowerController implements OnStart {
	protected cframe = CFrame.identity;

	public getSelected(): Option<string> {
		const selected = store.getState(selectSelectedTower);
		return selected;
	}

	public getMouseRaycast(): Option<RaycastResult> {
		if (camera === undefined) {
			return undefined;
		}
		const location = UserInputService.GetMouseLocation();
		const ray = camera.ViewportPointToRay(location.X, location.Y);
		const origin = ray.Origin;
		const direction = ray.Direction.mul(100);
		const results = Workspace.Raycast(origin, direction, params);
		return results;
	}

	public getTowerAncestor(descendant: BasePart): Option<Model> {
		const towers = CollectionService.GetTagged(ComponentTag.Tower);
		let result: Option<Model>;
		for (const tower of towers) {
			if (!tower.IsA("Model") || !descendant.IsDescendantOf(tower)) {
				continue;
			}
			result = tower;
			break;
		}
		return result;
	}

	public selectTower(): void {
		const results = this.getMouseRaycast();
		const current = this.getSelected();
		if (results === undefined) {
			this.deselectTower();
			return;
		}
		const instance = results.Instance;
		if (!instance.IsA("BasePart")) {
			this.deselectTower();
			return;
		}
		const model = this.getTowerAncestor(instance);
		const key = model?.GetAttribute(TOWER_KEY_ATTRIBUTE);
		if (model === undefined || key === undefined || !typeIs(key, "string")) {
			this.deselectTower();
			return;
		}
		if (key === current) {
			return;
		}
		// This may be faster than a state selection?
		const tower = Tower.getTower(key);
		if (tower === undefined || tower.owner !== getUser(player)) {
			this.deselectTower();
			return;
		}
		tower.enableRange();
		store.selectTower({ key });
	}

	public deselectTower(): void {
		const current = this.getSelected();
		if (current === undefined) {
			return;
		}
		store.deselectTower({});
	}

	public onStart(): void {
		PlacementController.onPlaced(async (placing: string, asset: Model): Promise<void> => {
			const { slot } = store.getState(selectPlacementState);
			if (slot === undefined) {
				return;
			}
			const { equipped } = store.getState(selectInventoryData);
			const tower = equipped.get(slot);
			if (tower === undefined) {
				return;
			}
			const { uuid } = tower;
			const cframe = asset.GetPivot();
			const position = cframe.Position;
			// !! Raycast downward to confirm valid placement location
			Events.tower.place(uuid, position);
			store.endPlacement({});
		});
		store.observe(
			selectPlacedTowers,
			(_: ReplicatedTower, key: string): defined => key,
			(replicated: ReplicatedTower): (() => void) => {
				const tower = new Tower(replicated);
				return (): void => {
					tower.destroy();
				};
			},
		);
		store.subscribe(selectSelectedTower, (selected: Option<string>, previous: Option<string>): void => {
			if (previous === undefined || selected === previous) {
				return;
			}
			const tower = Tower.getTower(previous);
			tower?.disableRange();
		});
		Events.tower.target.connect((key: string, target?: number): void => {
			if (target === undefined) {
				return;
			}
			const tower = Tower.getTower(key);
			const mob = Mob.getMob(target);
			if (tower === undefined || mob === undefined) {
				return;
			}
			const cframe = mob.getCFrame();
			const position = cframe.Position;
			tower.rotateToTarget(position);
		});
		UserInputService.InputBegan.Connect((input: InputObject, processed: boolean): void => {
			if (processed) {
				return;
			}
			const inputType = input.UserInputType;
			const inputState = input.UserInputState;
			if (inputType !== Enum.UserInputType.MouseButton1 || inputState !== Enum.UserInputState.Begin) {
				return;
			}
			this.selectTower();
		});
		// !! Consider allowing for hotkey'ing to towers, ie; pressing `1` would select the 1st tower and begin placement.
	}
}
