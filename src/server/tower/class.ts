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
import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";
import type { ReplicatedTower } from "shared/tower/types";

export class Tower extends API {
	public static readonly towers = new Map<string, Tower>();

	public declare readonly id: TowerItemId;
	public declare readonly uuid: string;
	public declare readonly index: number;
	public declare readonly cframe: CFrame;
	public declare readonly owner: string;

	protected declare readonly key: string;
	protected declare readonly unique: ItemTowerUnique;

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

	public constructor(tower: ReplicatedTower) {
		super(tower);
		const { towers } = Tower;
		const { key } = this;
		towers.set(key, this);
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

	public getUpgrades(): number {
		const { key } = this;
		const tower = store.getState(selectSpecificTower(key));
		if (tower === undefined) {
			return 1;
		}
		const { upgrades } = tower;
		return upgrades;
	}

	public getTarget(): Option<Mob> {
		const { cframe, unique } = this;
		const { range: rangeMulti } = unique;
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
		const { id, key, unique, lastAttack, lastTarget } = this;
		const { kind } = itemDefinitions[id];
		const { upgrades } = kind;
		const upgradeIndex = this.getUpgrades();
		const [, upgradeMulti] = upgrades[upgradeIndex - 1];
		const { cooldown: cooldownMulti, damage: damageMulti } = unique;
		const { cooldown: baseCooldown, damage: baseDamage } = kind;
		const cooldown = baseCooldown * cooldownMulti * upgradeMulti[2];
		const damage = baseDamage * damageMulti * upgradeMulti[1];
		const now = os.clock();
		if (now - lastAttack < cooldown) {
			return;
		}
		this.lastAttack = now;
		const currentTarget = this.getTarget();
		if (currentTarget !== lastTarget) {
			const target = currentTarget?.index;
			Events.tower.target.broadcast(key, target);
		}
		this.lastTarget = currentTarget;
		if (currentTarget === undefined) {
			return;
		}
		const { damageKind } = kind;
		currentTarget.takeDamage(damage, damageKind);
	}

	public upgradeTower(): void {
		const { key, owner } = this;
		store.upgradeTower({ key }, { user: owner, broadcast: true });
	}

	public destroy(): void {
		const { towers } = Tower;
		const { key } = this;
		towers.delete(key);
	}
}
