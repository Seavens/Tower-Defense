import { Tower as API } from "shared/api/tower";
import { Events } from "server/network";
import { Mob } from "./mob";
import { RunService } from "@rbxts/services";
import { TargetId, type TowerId } from "shared/types/ids";
import { TowerDefinitions } from "shared/definitions/towers";
import { reuseThread } from "shared/functions/reuse-thread";
import { serverProducer } from "server/state/producer";
import type { TowerStats } from "shared/api/tower";

export class Tower extends API {
	public static readonly towers = new Map<string, Tower>();

	public declare readonly id: TowerId;
	public declare readonly uuid: string;
	public declare readonly index: number;
	public declare readonly cframe: CFrame;

	public readonly owner: string;
	public stats: TowerStats;

	protected readonly base: TowerStats;

	protected lastAttack = 0;
	protected lastTarget: Option<Mob>;

	static {
		RunService.Heartbeat.Connect((delta: number): void => {
			const { towers } = this;
			for (const [_, tower] of towers) {
				reuseThread((): void => {
					tower.attackTarget(delta);
				});
			}
		});
	}

	public constructor(id: TowerId, uuid: string, index: number, cframe: CFrame, owner: string, stats: TowerStats) {
		const { towers } = Tower;
		super(id, uuid, index, cframe);
		const { key } = this;
		towers.set(key, this);
		this.owner = owner;
		this.stats = stats;
		this.base = stats;
		warn(id, uuid, index, owner, stats);
	}

	public getTarget(): Option<Mob> {
		const { cframe, stats } = this;
		const { range } = stats;
		const position = cframe.Position;
		const mobs = Mob.getMobsInRadius(position, range);

		const targetSelection = TargetId.First;

		if (targetSelection === TargetId.First) {
			const [first] = mobs;
			if (first === undefined) {
				return undefined;
			}
			const target = first.Object;
			return target;
		}
		if (targetSelection === TargetId.Last) {
			const last = mobs[mobs.size() - 1];
			if (last === undefined) {
				return undefined;
			}
			const target = last.Object;
			return target;
		}
		if (targetSelection === TargetId.Strongest) {
			let [{ Object: strongest }] = mobs;
			for (const { Object: mob } of mobs) {
				if (mob === undefined || strongest === undefined) {
					return undefined;
				}
				if (mob.getHealth() > strongest.getHealth()) {
					strongest = mob;
				}
			}
			if (strongest === undefined) {
				return undefined;
			}
			const target = strongest;
			return target;
		}
		if (targetSelection === TargetId.Weakest) {
			let [weakest] = mobs;
			for (const mob of mobs) {
				if (mob === undefined || weakest === undefined) {
					return undefined;
				}
				if (mob.Object.getHealth() < weakest.Object.getHealth()) {
					weakest = mob;
				}
			}
			if (weakest === undefined) {
				return undefined;
			}
			const target = weakest.Object;
			return target;
		}
		if (targetSelection === TargetId.Closest) {
			let [closest] = mobs;
			for (const mob of mobs) {
				if (mob === undefined || closest === undefined) {
					return undefined;
				}
				if (mob.Object.getCFrame().Position.Magnitude < closest.Object.getCFrame().Position.Magnitude) {
					closest = mob;
				}
			}
			if (closest === undefined) {
				return undefined;
			}
			const target = closest.Object;
			return target;
		}
		if (targetSelection === TargetId.Furthest) {
			let [furthest] = mobs;
			for (const mob of mobs) {
				if (mob === undefined || furthest === undefined) {
					return undefined;
				}
				if (mob.Object.getCFrame().Position.Magnitude > furthest.Object.getCFrame().Position.Magnitude) {
					furthest = mob;
				}
			}
			if (furthest === undefined) {
				return undefined;
			}
			const target = furthest.Object;
			return target;
		} else {
			return undefined;
		}
	}

	public attackTarget(delta: number): void {
		const { id, key, stats, lastAttack, lastTarget } = this;
		const { cooldown, damage } = stats;
		const now = os.clock();
		if (now - lastAttack < cooldown) {
			return;
		}
		this.lastAttack = now;
		const currentTarget = this.getTarget();
		warn(currentTarget === lastTarget);
		if (currentTarget !== lastTarget) {
			const target = currentTarget?.index;
			warn(target);
			Events.replicateTowerTarget.broadcast(key, target);
		}
		this.lastTarget = currentTarget;
		if (currentTarget === undefined) {
			return;
		}
		const { kind } = TowerDefinitions[id];
		currentTarget.takeDamage(damage, kind);
	}

	public upgradeTower(multiplier: number): void {
		const { uuid, index, base, owner } = this;
		const stats = { ...base };
		for (const [key, stat] of pairs(stats)) {
			stats[key] = stat * multiplier;
		}
		this.stats = stats;
		serverProducer.towerUpgrade({ uuid, index }, { user: owner, broadcast: true });
	}

	public destroy(): void {
		const { towers } = Tower;
		const { key } = this;
		towers.delete(key);
	}
}
