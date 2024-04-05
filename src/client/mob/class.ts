import { Mob as API } from "shared/mob/api";
import { GAME_TICK_RATE } from "shared/core/constants";
import { MobUtil } from "shared/mob/utils";
import { Signal } from "@rbxts/beacon";
import { Workspace } from "@rbxts/services";
import { createSchedule } from "shared/utils/create-schedule";
import { reuseThread } from "shared/utils/reuse-thread";
import type { Bin } from "@rbxts/bin";
import type { MobDamage, MobId, MobStatus } from "shared/mob/types";

export class Mob extends API {
	public static readonly mobs = new Map<UUID, Mob>();

	public static readonly onMobAdded = new Signal<Mob>();
	public static readonly onMobRemoved = new Signal<Mob>();
	public static readonly onMobEnded = new Signal<Mob>();
	public static readonly onMobDied = new Signal<Mob>();

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
		const { mobs, onMobAdded } = Mob;
		const { bin } = this;
		const model = MobUtil.getMobModel(id);
		model.Parent = Workspace.mobs;
		this.instance = model;
		model.Name = uuid;
		bin.add(model);
		onMobAdded.FireDeferred(this);
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

	public getDuration(): number {
		const { duration } = this;
		return duration;
	}

	public onDied(): void {}

	public onDamage(damage: number, kind?: MobDamage): void {}

	public onWaypoint(): void {}

	public onMovement(delta: number): void {
		const { instance } = this;
		const cframe = this.getCFrame();
		instance.PivotTo(cframe);
	}

	public onStatus(status: MobStatus, duration: number, added: boolean): void {}

	public onEnd(): void {}

	public onResync(): void {}

	public destroy(): void {
		const { mobs, onMobRemoved } = Mob;
		const { uuid, instance } = this;
		if (this.isDestroyed()) {
			return;
		}
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
