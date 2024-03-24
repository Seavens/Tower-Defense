import { Mob as API } from "shared/api/mob";
import { MobUtility } from "shared/modules/mob-utility";
import { RunService, Workspace } from "@rbxts/services";
import { Signal } from "@rbxts/beacon";
import { reuseThread } from "shared/functions/reuse-thread";
import type { Bin } from "@rbxts/bin";
import type { DamageKind } from "shared/types/kinds";
import type { MobId, StatusId } from "shared/types/ids";

export class Mob extends API {
	public static readonly mobs = new Map<number, Mob>();

	public static readonly onMobAdded = new Signal<Mob>();
	public static readonly onMobRemoved = new Signal<Mob>();
	public static readonly onMobEnded = new Signal<Mob>();
	public static readonly onMobDied = new Signal<Mob>();

	public declare readonly index: number;
	public declare readonly id: MobId;

	protected declare readonly bin: Bin;
	protected declare readonly waypoints: Array<BasePart>;
	protected declare readonly statuses: Map<StatusId, number>;
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
		RunService.Heartbeat.Connect((delta: number): void => {
			const { mobs } = this;
			for (const [_, mob] of mobs) {
				reuseThread((): void => {
					mob.onTick(delta);
				});
			}
		});
	}

	public constructor(index: number, id: MobId) {
		super(index, id);
		const { mobs, onMobAdded } = Mob;
		const { bin } = this;
		const model = MobUtility.getInstance(id);
		model.Parent = Workspace.mobs;
		this.instance = model;
		bin.add(model);
		onMobAdded.FireDeferred(this);
		mobs.set(index, this);
	}

	public static getMob(index: number): Option<Mob> {
		const { mobs } = this;
		const mob = mobs.get(index);
		return mob;
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

	public onDied(): void {
		//
	}

	public onDamage(damage: number, kind: DamageKind): void {
		//
	}

	public onWaypoint(): void {
		//
	}

	public onMovement(): void {
		const { instance } = this;
		const cframe = this.getCFrame();
		instance.PivotTo(cframe);
	}

	public onStatus(status: StatusId, duration: number, added: boolean): void {
		//
	}

	public onEnd(): void {
		//
	}

	public onResync(): void {
		//
	}

	public destroy(): void {
		const { mobs, onMobRemoved } = Mob;
		const { index } = this;
		if (this.isDestroyed()) {
			return;
		}
		onMobRemoved.FireDeferred(this);
		task.defer((): void => {
			mobs.delete(index);
		});
		super.destroy();
	}
}
