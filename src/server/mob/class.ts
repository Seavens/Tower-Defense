import { Mob as API } from "shared/mob/api";
import { Events } from "server/network";
import { GAME_TICK_RATE } from "shared/core/constants";
import { MobUtility } from "shared/mob/utility";
import { Signal } from "@rbxts/beacon";
import { Workspace } from "@rbxts/services";
import { createSchedule } from "shared/utility/functions/create-schedule";
import { reuseThread } from "shared/utility/functions/reuse-thread";
import { selectGameData } from "shared/game/selectors";
import { store } from "server/state/store";
import Octree from "@rbxts/octo-tree";
import type { Bin } from "@rbxts/bin";
import type { MobDamage, MobId, MobStatus } from "shared/mob/types";
import type { Node } from "@rbxts/octo-tree";

export class Mob extends API {
	public static readonly mobs = new Map<UUID, Mob>();

	public static readonly onMobAdded = new Signal<Mob>();
	public static readonly onMobRemoved = new Signal<Mob>();
	public static readonly onMobEnded = new Signal<Mob>();
	public static readonly onMobDied = new Signal<[mob: Mob, tower?: string]>();

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
		const { mobs, octree, onMobAdded } = Mob;
		super(uuid, id);
		const gameStore = store.getState(selectGameData);
		const { wave } = gameStore;
		this.health = MobUtility.getMobHealth(id, wave);
		const { waypoints } = this;
		const [first] = waypoints;
		const position = first.Position;
		const node = octree.CreateNode(position, this);
		this.node = node;
		onMobAdded.FireDeferred(this);
		mobs.set(uuid, this);
		this.start();
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
		for (const [_, mob] of mobs) mob.forceKill();
	}

	public onDied(key?: string): void {
		const { onMobDied } = Mob;
		const { uuid } = this;
		Events.mob.death.broadcast(uuid);
		onMobDied.FireDeferred(this, key);
	}

	public onDamage(damage: number, kind: MobDamage): void {
		const { uuid } = this;
		Events.mob.damage.broadcast(uuid, damage, kind);
	}

	public onWaypoint(): void {
		const { uuid, current, target } = this;
		Events.mob.resync.broadcast(uuid, current, target, 0);
	}

	public onMovement(): void {
		const { octree } = Mob;
		const { node, movement } = this;
		const now = os.clock();
		if (now - movement < GAME_TICK_RATE) return;
		this.movement = now;
		const cframe = this.getCFrame();
		const position = cframe.Position;
		octree.ChangeNodePosition(node, position);
	}

	public onStatus(status: MobStatus, duration: number, added: boolean): void {
		const { uuid } = this;
		const timestamp = Workspace.GetServerTimeNow();
		// const module = statusModules[status];
		// if (!added) {
		// 	module?.onRemove?.(this);
		// 	Events.mob.statusRemoved.broadcast(uuid, status);
		// 	return;
		// }
		// module?.onAdded?.(this);
		// Events.mob.statusAdded.broadcast(uuid, duration, status, timestamp);
	}

	public onEnd(): void {
		const { onMobEnded } = Mob;
		onMobEnded.FireDeferred(this);
	}

	public onResync(): void {
		const { uuid } = this;
		const { current } = this;
		const alpha = this.getAlpha();
		const now = Workspace.GetServerTimeNow();
		Events.mob.resync.broadcast(uuid, current, alpha, now);
	}

	public destroy(): void {
		const { mobs, octree, onMobRemoved } = Mob;
		const { node, uuid } = this;
		if (this.isDestroyed()) return;

		octree.RemoveNode(node);
		store.deleteStatus({}, { user: uuid, broadcast: true });
		onMobRemoved.FireDeferred(this);
		mobs.delete(uuid);
		super.destroy();
	}
}
