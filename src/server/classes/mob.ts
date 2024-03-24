import { Mob as API } from "shared/api/mob";
import { Events } from "server/network";
import { MOB_POSITION_UPDATE } from "shared/constants/core-constants";
import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { Signal } from "@rbxts/beacon";
import { reuseThread } from "shared/functions/reuse-thread";
import Octree from "@rbxts/octo-tree";
import type { Bin } from "@rbxts/bin";
import type { DamageKind } from "shared/types/kinds";
import type { MobId, StatusId } from "shared/types/ids";
import type { Node } from "@rbxts/octo-tree";

export class Mob extends API {
	public static readonly mobs = new Map<number, Mob>();

	public static readonly onMobAdded = new Signal<Mob>();
	public static readonly onMobRemoved = new Signal<Mob>();
	public static readonly onMobEnded = new Signal<Mob>();
	public static readonly onMobDied = new Signal<Mob>();

	protected static octree = new Octree<Mob>();

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

	protected readonly node: Node<Mob>;

	protected movement = os.clock();

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
		const { mobs, octree, onMobAdded } = Mob;
		super(index, id);
		const { waypoints } = this;
		const [first] = waypoints;
		const position = first.Position;
		const node = octree.CreateNode(position, this);
		this.node = node;
		onMobAdded.FireDeferred(this);
		mobs.set(index, this);
		this.start();
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

	public onDied(): void {
		const { index } = this;
		Events.replicateMobDeath.broadcast(index);
	}

	public onDamage(damage: number, kind: DamageKind): void {
		const { index } = this;
		const data = new Vector2int16(index, damage);
		Events.replicateMobDamage.broadcast(data, kind);
	}

	public onWaypoint(): void {
		const { index } = this;
		const { current, target } = this;
		const first = new Vector2int16(index, current);
		const second = new Vector2int16(target, 0);
		Events.replicateMobResync.broadcast(first, second);
	}

	public onMovement(): void {
		const { octree } = Mob;
		const { node, movement } = this;
		const now = os.clock();
		// Optimization, octree position changes can potentially be expensive.
		if (now - movement < MOB_POSITION_UPDATE) {
			return;
		}
		this.movement = now;
		const cframe = this.getCFrame();
		const position = cframe.Position;
		octree.ChangeNodePosition(node, position);
	}

	public onStatus(status: StatusId, duration: number, added: boolean): void {
		const { index } = this;
		const timestamp = Workspace.GetServerTimeNow();
		if (!added) {
			Events.replicateMobStatusRemoved.broadcast(index, status);
			return;
		}
		const data = new Vector2int16(index, duration);
		Events.replicateMobStatusAdded.broadcast(data, status, timestamp);
	}

	public onEnd(): void {
		const { onMobEnded } = Mob;
		onMobEnded.FireDeferred(this);
	}

	public onResync(): void {
		const { index } = this;
		const { current, target } = this;
		const alpha = this.getAlpha();
		const first = new Vector2int16(index, current);
		const second = new Vector2int16(target, alpha * 1000);
		Events.replicateMobResync.broadcast(first, second);
	}

	public destroy(): void {
		const { mobs, octree, onMobRemoved } = Mob;
		const { node, index } = this;
		if (this.isDestroyed()) {
			return;
		}
		octree.RemoveNode(node);
		onMobRemoved.FireDeferred(this);
		mobs.delete(index);
		super.destroy();
	}
}
