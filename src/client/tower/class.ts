import { Tower as API } from "shared/tower/api";
import { Animator } from "client/animation/animator";
import { Bin } from "@rbxts/bin";
import { Collision, setCollision } from "shared/utility/collision";
import { ComponentTag } from "shared/components/types";
import { GAME_TICK_RATE } from "shared/core/constants";
import { Mob } from "client/mob/class";
import { PALETTE } from "client/ui/constants";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { SoundEffect } from "shared/classes/sound";
import { TOWER_KEY_ATTRIBUTE } from "./constants";
import { TowerAnimation } from "shared/tower/types";
import { TowerUtility } from "shared/tower/utility";
import { createSchedule } from "shared/utility/create-schedule";
import { itemDefinitions } from "shared/inventory/items";
import { reuseThread } from "shared/utility/reuse-thread";
import { selectSpecificTower } from "shared/tower/selectors";
import { store } from "client/state/store";
import { targetingModules } from "shared/tower/targeting";
import { towerVisualModules } from "./visuals";
import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";
import type { ReplicatedTower, TowerTargeting } from "shared/tower/types";

const {
	assets: { towers: assets },
} = ReplicatedStorage;
const { map, placed, debris } = Workspace;

export class Tower extends API {
	public static towers = new Map<string, Tower>();

	public declare readonly id: TowerItemId;
	public declare readonly uuid: UUID;
	public declare readonly cframe: CFrame;
	public declare readonly owner: string;

	public readonly instance: Model;
	public sphere: Option<BasePart>;
	public circle: Option<BasePart>;

	protected declare readonly key: string;
	protected declare readonly unique: ItemTowerUnique;

	protected readonly bin = new Bin();

	protected lastAttack = 0;
	protected lastTarget: Option<Mob>;

	protected readonly animator: Animator<TowerAnimation>;

	static {
		createSchedule({
			name: "TowerTick",
			tick: GAME_TICK_RATE,
			phase: 0,
			onTick: (): void => {
				const { towers } = this;
				for (const [_, tower] of towers) {
					reuseThread((): void => {
						tower.onTick();
					});
				}
			},
		});
	}

	public constructor(tower: ReplicatedTower) {
		super(tower);
		const { towers } = Tower;
		const { id, cframe, key, bin } = this;

		const model = assets.FindFirstChild(id);
		if (model === undefined || !model.IsA("Model")) {
			throw `Could not find model for Tower(${id})!`;
		}

		const instance = model.Clone();
		setCollision(instance, Collision.Tower, true);
		instance.AddTag(ComponentTag.Tower);
		instance.PivotTo(cframe);
		instance.SetAttribute(TOWER_KEY_ATTRIBUTE, key);

		const { kind } = itemDefinitions[id];
		const { visual } = kind;
		const module = towerVisualModules[visual[0]];
		const { duration } = module;
		const temporary = new Bin();
		module.onEffect(temporary, instance);
		bin.add(temporary);
		task.delay(duration, (): void => {
			temporary.destroy();
		});

		const { sounds } = kind;
		const sound = new SoundEffect(instance, sounds[TowerAnimation.Summon][0]);
		sound.destroyAfterPlay(0.5);

		const { animations } = kind;

		instance.Parent = placed;
		const animator = new Animator<TowerAnimation>(instance, animations);
		this.instance = instance;
		this.animator = animator;
		bin.add(animator);
		bin.add(instance);
		animator.playAnimation(TowerAnimation.Summon);
		towers.set(key, this);
	}

	public static getTower(key: string): Option<Tower> {
		const { towers } = this;
		return towers.get(key);
	}

	public getReplicated(): ReplicatedTower {
		const { key } = this;
		const tower = store.getState(selectSpecificTower(key));
		if (tower === undefined) {
			throw "Tower does not exist!";
		}
		return tower;
	}

	public getGround(): number {
		const { spawn } = map;
		if (spawn === undefined) {
			return 0;
		}
		const position = spawn.Position;
		return position.Y;
	}

	public getTargeting(): TowerTargeting {
		const { targeting } = this.getReplicated();
		return targeting;
	}

	public getTarget(): Option<Mob> {
		const { cframe } = this;
		const position = cframe.Position;
		const replicated = this.getReplicated();
		const range = TowerUtility.getTotalRange(replicated);
		const mobs = Mob.getMobsInRadius(position, range);
		const targeting = this.getTargeting();
		const module = targetingModules[targeting];
		const target = module.getTarget(mobs);
		return target as Option<Mob>;
	}

	public getRange(origin = this.getGround()): number {
		const replicated = this.getReplicated();
		const range = TowerUtility.getTotalRange(replicated);
		const ground = this.getGround();
		const displacement = origin - ground;
		const chord = 2 * math.sqrt(range ** 2 - displacement ** 2);
		return chord;
	}

	public upgradeTower(): void {
		const { instance, sphere, circle } = this;
		if (sphere !== undefined) {
			const size = this.getRange();
			sphere.Size = Vector3.one.mul(size);
		}
		if (circle !== undefined) {
			const cframe = instance.GetPivot();
			const position = cframe.Position;
			const offset = position.Y;
			const size = this.getRange(offset);
			circle.Size = new Vector3(0.1, size, size);
		}
	}

	public enableVisuals(): void {
		const { instance } = this;
		const offset = instance.GetExtentsSize().div(2);
		const pivot = instance.GetPivot();
		const relative = new CFrame(
			pivot.PointToWorldSpace(Vector3.yAxis.mul(offset.Y)).add(Vector3.yAxis.mul(offset.Y * -2)),
		);

		const sphere = new Instance("Part");
		sphere.Shape = Enum.PartType.Ball;
		sphere.Size = Vector3.one.mul(this.getRange());
		sphere.CastShadow = false;
		sphere.Anchored = true;
		sphere.CFrame = relative;
		sphere.Material = Enum.Material.ForceField;
		sphere.Color = new Color3(PALETTE.green.R, PALETTE.green.G, PALETTE.green.B);
		sphere.Transparency = 0.5;
		sphere.CanCollide = false;
		sphere.Parent = debris;
		this.sphere = sphere;

		const ground = this.getGround();
		const position = pivot.Position;
		const size = this.getRange(position.Y);
		const circle = new Instance("Part");
		circle.Shape = Enum.PartType.Cylinder;
		circle.Size = new Vector3(0.1, size, size);
		circle.CastShadow = false;
		circle.Anchored = true;
		circle.CFrame = new CFrame(relative.Position.X, ground, relative.Position.Z)
			.mul(new CFrame(0, 0.05, 0))
			.mul(CFrame.Angles(0, 0, math.rad(90)));
		circle.Material = Enum.Material.SmoothPlastic;
		circle.Color = new Color3(PALETTE.green.R, PALETTE.green.G, PALETTE.green.B);
		circle.Transparency = 0.75;
		circle.CanCollide = false;
		circle.Parent = debris;
		this.circle = circle;
	}

	public disableVisuals(): void {
		const { sphere, circle } = this;
		sphere?.Destroy();
		circle?.Destroy();
	}

	public attackTarget(target: Option<Mob>): void {
		const { id, bin, instance } = this;
		const { kind } = itemDefinitions[id];
		const { visual } = kind;
		// Change for abilities later
		const module = towerVisualModules[visual[1]];
		const { duration } = module;
		const temporary = new Bin();
		module.onEffect(temporary, instance, target);

		bin.add(temporary);
		task.delay(duration, (): void => {
			temporary.destroy();
		});
	}

	public onTick(): void {
		const { instance, cframe } = this;
		const mob = this.getTarget();
		if (mob === undefined) {
			return;
		}
		const target = mob.getCFrame();
		const position = target.Position;
		const current = cframe.Position;
		const pivot = CFrame.lookAt(current, new Vector3(position.X, current.Y, position.Z), Vector3.yAxis);
		instance.PivotTo(pivot);
	}

	public destroy(): void {
		const { towers } = Tower;
		const { instance, sphere, circle, key, bin } = this;
		bin.destroy();
		towers.delete(key);
		instance.Destroy();
		sphere?.Destroy();
		circle?.Destroy();
	}
}
