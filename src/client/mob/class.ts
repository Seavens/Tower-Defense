import { Mob as API } from "shared/mob/api";
import { Animator } from "client/animation/animator";
import { GAME_TICK_RATE } from "shared/core/constants";
import { MobAnimation } from "shared/mob/types";
import { MobUtility } from "shared/mob/utility";
import { Signal } from "@rbxts/beacon";
import { SoundEffect } from "shared/classes/sound";
import { Workspace } from "@rbxts/services";
import { createSchedule } from "shared/utility/create-schedule";
import { mobDefinitions } from "shared/mob/definitions";
import { reuseThread } from "shared/utility/reuse-thread";
import { statusModules } from "shared/mob/modules";
import Octree from "@rbxts/octo-tree";
import type { Bin } from "@rbxts/bin";
import type { MobDamage, MobId, MobStatus } from "shared/mob/types";
import type { Node } from "@rbxts/octo-tree";

export class Mob extends API {
	public static readonly mobs = new Map<UUID, Mob>();

	public static readonly onMobAdded = new Signal<Mob>();
	public static readonly onMobRemoved = new Signal<Mob>();
	public static readonly onMobEnded = new Signal<Mob>();
	public static readonly onMobDied = new Signal<Mob>();
	public static readonly onMobDamaged = new Signal<Mob>();

	protected static octree = new Octree<Mob>();

	public declare readonly uuid: UUID;
	public declare readonly id: MobId;

	protected declare readonly bin: Bin;
	protected declare readonly waypoints: Array<BasePart>;
	protected declare readonly statuses: Map<MobStatus, number>;
	protected declare readonly max: number;

	protected declare health: number;
	protected declare target: number;
	protected declare current: number;
	protected declare final: number;
	protected declare elapsed: number;
	protected declare duration: number;
	protected declare destroyed: boolean;
	protected readonly instance: Model;
	protected readonly animator: Animator<MobAnimation>;

	protected readonly node: Node<Mob>;

	protected movement = os.clock();

	static {
		createSchedule({
			name: "MobTick",
			tick: GAME_TICK_RATE,
			phase: 0.33 * GAME_TICK_RATE,
			onTick: (delta: number): void => {
				const { mobs } = this;
				for (const [_, mob] of mobs) {
					reuseThread((): void => {
						mob.onTick(delta);
					});
				}
			},
		});
	}

	public constructor(uuid: UUID, id: MobId) {
		super(uuid, id);
		const { mobs, onMobAdded, octree } = Mob;
		const { waypoints, bin } = this;
		const model = MobUtility.getMobModel(id);
		const [first] = waypoints;
		const position = first.Position;
		const node = octree.CreateNode(position, this);
		const { animations } = mobDefinitions[id];
		const animator = new Animator<MobAnimation>(model, animations);
		model.Parent = Workspace.mobs;
		model.Name = uuid;
		bin.add(model);
		bin.add(animator);
		this.node = node;
		this.instance = model;
		this.animator = animator;
		onMobAdded.FireDeferred(this);
		animator.playAnimation(MobAnimation.Walk);
		mobs.set(uuid, this);
	}

	public static getMob(uuid: UUID): Option<Mob> {
		const { mobs } = this;
		const mob = mobs.get(uuid);
		return mob;
	}

	public static getMobs(): Map<UUID, Mob> {
		const { mobs } = this;
		return mobs;
	}

	public static getMobCount(): number {
		const { mobs } = this;
		return mobs.size();
	}

	public static getMobsInRadius(position: Vector3, radius: number): Array<Node<Mob>> {
		const { octree } = this;
		const mobs = octree.SearchRadius(position, radius);
		return mobs;
	}

	public static removeAllMobs(): void {
		const { mobs } = this;
		for (const [_, mob] of mobs) {
			mob.forceKill();
		}
	}

	public setHealth(value: number): void {
		const { health } = this;
		if (value <= 0) {
			return;
		}
		const damage = health - value;
		this.health = value;
		this.onDamage(damage);
	}

	public getInstance(): Model {
		const { instance } = this;
		return instance;
	}

	public getDuration(): number {
		const { duration } = this;
		return duration;
	}

	public onDied(): void {
		// const sound = new SoundEffect(this.instance, "rbxassetid://155288625");
		// sound.playOnRemove(0.32);
	}

	public onDamage(damage: number, kind?: MobDamage): void {
		const { onMobDamaged } = Mob;
		onMobDamaged.FireDeferred(this);
	}

	public onWaypoint(): void {}

	public onMovement(delta: number): void {
		const { octree } = Mob;
		const { instance, movement, node } = this;
		const cframe = this.getCFrame();
		instance.PivotTo(cframe);
		const now = os.clock();
		if (now - movement < GAME_TICK_RATE) return;
		this.movement = now;
		const position = cframe.Position;
		octree.ChangeNodePosition(node, position);
	}

	public onStatus(status: MobStatus, duration: number, added: boolean): void {
		const module = statusModules[status];
		if (added) {
			module?.onAdded?.(this);
		} else {
			module?.onRemove?.(this);
		}
	}

	public onEnd(): void {}

	public onResync(): void {}

	public destroy(): void {
		const { mobs, onMobRemoved, octree } = Mob;
		const { uuid, instance, node } = this;
		if (this.isDestroyed()) {
			return;
		}
		octree.RemoveNode(node);
		onMobRemoved.FireDeferred(this);
		task.defer((): void => {
			mobs.delete(uuid);
		});
		super.destroy();
		pcall((): void => {
			instance.Destroy();
		});
	}
}
