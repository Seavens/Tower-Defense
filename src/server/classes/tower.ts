import { Tower as API } from "shared/api/tower";
import { Events } from "server/network";
import { Mob } from "./mob";
import { RunService } from "@rbxts/services";
import { TargetId, type TowerId } from "shared/types/ids";
import { TowerDefinitions } from "shared/definitions/towers";
import { reuseThread } from "shared/functions/reuse-thread";
import { selectSpecificTower } from "shared/state/selectors";
import { serverProducer } from "server/state/producer";
import { targetingModules } from "server/modules/targeting";
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

	public static getTower(key: string): Option<Tower> {
		const { towers } = this;
		return towers.get(key);
	}

	public isTargetingValid(targeting: TargetId): boolean {
		const { id } = this;
		const { targeting: allowed } = TowerDefinitions[id];
		if (!allowed.includes(targeting)) {
			return false;
		}
		return true;
	}

	public setTargeting(targeting: TargetId): void {
		if (!this.isTargetingValid(targeting)) {
			return;
		}
		const { key, owner } = this;
		serverProducer.towerSetTargeting({ key, targeting }, { user: owner, broadcast: true });
	}

	public getTargeting(): TargetId {
		const { id, key } = this;
		const tower = serverProducer.getState(selectSpecificTower(key));
		if (tower === undefined) {
			const {
				targeting: [targeting],
			} = TowerDefinitions[id];
			return targeting;
		}
		return tower.targeting;
	}

	public getTarget(): Option<Mob> {
		const { cframe, stats } = this;
		const { range } = stats;
		const position = cframe.Position;
		const mobs = Mob.getMobsInRadius(position, range);
		const targeting = TargetId.First;
		const module = targetingModules[targeting];
		const target = module.getTarget(mobs);
		return target;
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
		if (currentTarget !== lastTarget) {
			const target = currentTarget?.index;
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
		const { key, base, owner } = this;
		const stats = { ...base };
		for (const [key, stat] of pairs(stats)) {
			stats[key] = stat * multiplier;
		}
		this.stats = stats;
		serverProducer.towerUpgrade({ key }, { user: owner, broadcast: true });
	}

	public destroy(): void {
		const { towers } = Tower;
		const { key } = this;
		towers.delete(key);
	}
}
