/* eslint-disable roblox-ts/lua-truthiness */
import { Tower as API } from "shared/tower/api";
import { Animator } from "shared/assets/animator";
import { Bin } from "@rbxts/bin";
import { Collision, setCollision } from "shared/utility/collision";
import { ComponentTag } from "shared/utility/components/types";
import { GAME_TICK_RATE } from "shared/core/constants";
import { Mob } from "client/mob/class";
import { PALETTE } from "client/ui/constants";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { SoundEmitter } from "shared/assets/sound";
import { TOWER_KEY_ATTRIBUTE } from "./constants";
import { TowerAnimation, TowerSounds, TowerTargeting, TowerVisual, TowerVisuals } from "shared/tower/types";
import { TowerUtility } from "shared/tower/utility";
import { VisualController } from "client/assets/visuals/controller";
import { createSchedule } from "shared/utility/functions/create-schedule";
import { itemDefinitions } from "shared/inventory";
import { reuseThread } from "shared/utility/functions/reuse-thread";
import { selectSpecificTower } from "shared/tower/selectors";
import { store } from "client/state/store";
import { targetingModules } from "shared/tower/targeting";
import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";
import type { ReplicatedTower } from "shared/tower/types";

const {
	assets: { items: assets },
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
	protected readonly sounds: SoundEmitter<TowerSounds>;
	protected readonly animator: Animator<TowerAnimation>;

	protected lastAttack = 0;
	protected lastTarget: Option<Mob>;

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
		const { visuals, sounds, animations } = kind;
		const visual = visuals[TowerVisuals.Summon];
		VisualController.onEffect(visual, instance, undefined, this.getReplicated());

		const soundEmitter = new SoundEmitter<TowerSounds>(instance, sounds);
		const animator = new Animator<TowerAnimation>(instance, animations);
		task.defer((): void => {
			const track = animator.playAnimation(TowerAnimation.Summon);
			soundEmitter.playSound(TowerSounds.Summon);
			task.delay(track.Length - 0.25, (): void => {
				track.Stop();
			});
		});

		instance.Parent = placed;
		this.instance = instance;
		this.animator = animator;
		this.sounds = soundEmitter;

		bin.add(soundEmitter);
		bin.add(animator);
		bin.add(instance);
		towers.set(key, this);
	}

	public static getTower(key: string): Option<Tower> {
		const { towers } = this;
		return towers.get(key);
	}

	public getInstance(): Model {
		const { instance } = this;
		return instance;
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
		const { instance } = this;

		VisualController.onEffect(TowerVisual.SniperShot, instance, target, this.getReplicated());
		instance.Parent = placed;

		const { animator } = this;
		const track = animator.playAnimation(TowerAnimation.Attack);
		task.delay(track.Length - 0.25, (): void => {
			track.Stop();
		});
	}

	public onTick(): void {
		const { instance, cframe } = this;
		const mob = this.getTarget();
		if (mob === undefined || mob.isDead()) {
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
		const { instance, sphere, circle, key, bin, id, index, cframe, uuid, unique } = this;

		// onEffect requires a `ReplicatedTower`, at this point, the tower is already out of state
		// therefore we just create a fake `ReplicatedTower` to appease it -- also because we need
		// id from it.
		const fake: ReplicatedTower = {
			id,
			index,
			key,
			owner: "",
			position: cframe.Position,
			targeting: TowerTargeting.First,
			unique,
			upgrades: 1,
			uuid,
		};
		VisualController.onEffect(TowerVisual.HeatedImpact, instance, undefined, fake);

		const { animator } = this;
		const track = animator.getAnimation(TowerAnimation.Sell);
		animator.playAnimation(TowerAnimation.Sell);

		const { sounds } = this;
		sounds.playSound(TowerSounds.Sell, 1);

		task.delay(0.7, (): void => {
			sounds.playSound(TowerSounds.Sell, 0);
		});

		task.delay(track.Length, (): void => bin.destroy());

		towers.delete(key);
		sphere?.Destroy();
		circle?.Destroy();
	}
}
