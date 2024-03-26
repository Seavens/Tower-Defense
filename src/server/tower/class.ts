import { Tower as API } from "shared/tower/api";
import { Events } from "server/network";
import { Mob } from "../mob/class";
import { RunService } from "@rbxts/services";
import { TowerTargeting } from "shared/tower/types";
import { itemDefinitions } from "shared/inventory/items";
import { reuseThread } from "shared/utils/reuse-thread";
import { selectSpecificTower } from "shared/tower/selectors";
import { store } from "server/state/store";
import { targetingModules } from "server/tower/targeting";
import type { ItemTowerClass, TowerItemId } from "shared/inventory/types";

export class Tower extends API {
	public static readonly towers = new Map<string, Tower>();

	public declare readonly id: TowerItemId;
	public declare readonly uuid: string;
	public declare readonly index: number;
	public declare readonly cframe: CFrame;

	public readonly owner: string;
	public readonly props: ItemTowerClass;

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

	public constructor(
		id: TowerItemId,
		uuid: string,
		index: number,
		cframe: CFrame,
		owner: string,
		props: ItemTowerClass,
	) {
		const { towers } = Tower;
		super(id, uuid, index, cframe);
		const { key } = this;
		towers.set(key, this);
		this.owner = owner;
		this.props = props;
	}

	public static getTower(key: string): Option<Tower> {
		const { towers } = this;
		return towers.get(key);
	}

	public isTargetingValid(targeting: TowerTargeting): boolean {
		const { id } = this;
		const { targeting: allowed } = itemDefinitions[id].kind;
		if (allowed.includes(targeting) === false) {
			return false;
		}
		return true;
	}

	public setTargeting(targeting: TowerTargeting): void {
		if (!this.isTargetingValid(targeting)) {
			return;
		}
		const { key, owner } = this;
		store.setTowerTargeting({ key, targeting }, { user: owner, broadcast: true });
	}

	public getTargeting(): TowerTargeting {
		const { id, key } = this;
		const tower = store.getState(selectSpecificTower(key));
		if (tower === undefined) {
			const {
				targeting: [targeting],
			} = itemDefinitions[id].kind;
			return targeting;
		}
		return tower.targeting;
	}

	public getTarget(): Option<Mob> {
		const { cframe, props } = this;
		const { range: rangeMulti } = props;
		const defRange = itemDefinitions[this.id].kind.range;
		const range = defRange * rangeMulti;
		const position = cframe.Position;
		const mobs = Mob.getMobsInRadius(position, range);
		const targeting = TowerTargeting.First;
		const module = targetingModules[targeting];
		const target = module.getTarget(mobs);
		return target;
	}

	public attackTarget(delta: number): void {
		const { id, key, props, lastAttack, lastTarget } = this;
		const definition = itemDefinitions[id];
		const { cooldown: cooldownMulti, damage: damageMulti } = props;
		const { cooldown: baseCooldown, damage: baseDamage } = definition.kind;
		const cooldown = baseCooldown * cooldownMulti;
		const damage = baseDamage * damageMulti;
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
		const { damageKind: kind } = definition.kind;
		currentTarget.takeDamage(damage, kind);
	}

	public upgradeTower(multiplier: number): void {
		// const { key, base, owner } = this;
		// const stats = { ...base };
		// for (const [key, stat] of pairs(stats)) {
		// 	stats[key] = stat * multiplier;
		// }
		// this.stats = stats;
		// store.upgradeTower({ key }, { user: owner, broadcast: true });
	}

	public destroy(): void {
		const { towers } = Tower;
		const { key } = this;
		towers.delete(key);
	}
}
