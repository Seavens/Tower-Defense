import { Mob as API } from "shared/mob/api";
import { Events } from "server/network";
import { GAME_TICK_RATE } from "shared/core/core-constants";
import { Signal } from "@rbxts/beacon";
import { Workspace } from "@rbxts/services";
import { createSchedule } from "shared/utils/create-schedule";
import { mobDefinitions } from "shared/mob/mobs";
import { profileSlice } from "server/profile/slice";
import { reuseThread } from "shared/utils/reuse-thread";
import { selectProfileData } from "server/profile/selectors";
import { selectSpecificTower } from "shared/tower/selectors";
import { store } from "server/state/store";
import Octree from "@rbxts/octo-tree";
import type { Bin } from "@rbxts/bin";
import type { MobDamage, MobId, MobStatus } from "shared/mob/types";
import type { Node } from "@rbxts/octo-tree";

export class Mob extends API {
	public static readonly mobs = new Map<number, Mob>();

	public static readonly onMobAdded = new Signal<Mob>();
	public static readonly onMobRemoved = new Signal<Mob>();
	public static readonly onMobEnded = new Signal<Mob>();
	public static readonly onMobDied = new Signal<[mob: Mob, tower: string]>();

	protected static octree = new Octree<Mob>();

	public declare readonly index: number;
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

	public onDied(key?: string): void {
		const { index } = this;

		Events.mob.death.broadcast(index);
		if (key === undefined) {
			return;
		}

		const replicated = store.getState(selectSpecificTower(key));
		if (replicated === undefined) {
			return;
		}

		const user = replicated?.owner;
		if (user === undefined) {
			return;
		}

		const profile = store.getState(selectProfileData(user));
		if (profile === undefined) {
			return;
		}

		const mobDef = mobDefinitions[this.id];
		const { bounty, experience } = mobDef;

		// Add currency to the tower
		store.gameAddCurrency({ amount: bounty }, { user, broadcast: true });
		// store.profileAddExperience({ amount: experience }, { user: user, replicate: true });
		store.towerAddExperience(
			{
				amount: experience,
				key: key,
			},
			{ broadcast: true },
		);

		warn(
			"Profile: Level: " + profile.level,
			"Profile: Experience: " + profile.experience,
			"Tower: Level: " + replicated.unique.level,
			"Tower: Experience: " + replicated.unique.experience,
		);
	}

	public onDamage(damage: number, kind: MobDamage): void {
		const { index } = this;
		const data = new Vector2int16(index, damage);
		Events.mob.damage.broadcast(data, kind);
	}

	public onWaypoint(): void {
		const { index } = this;
		const { current, target } = this;
		const first = new Vector2int16(index, current);
		const second = new Vector2int16(target, 0);
		Events.mob.resync.broadcast(first, second);
	}

	public onMovement(): void {
		const { octree } = Mob;
		const { node, movement } = this;
		const now = os.clock();
		// Optimization, octree position changes can potentially be expensive.
		if (now - movement < GAME_TICK_RATE) {
			return;
		}
		this.movement = now;
		const cframe = this.getCFrame();
		const position = cframe.Position;
		octree.ChangeNodePosition(node, position);
	}

	public onStatus(status: MobStatus, duration: number, added: boolean): void {
		const { index } = this;
		const timestamp = Workspace.GetServerTimeNow();
		if (!added) {
			Events.mob.statusRemoved.broadcast(index, status);
			return;
		}
		const data = new Vector2int16(index, duration);
		Events.mob.statusAdded.broadcast(data, status, timestamp);
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
		Events.mob.resync.broadcast(first, second);
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
