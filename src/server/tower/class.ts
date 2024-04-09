import { Tower as API } from "shared/tower/api";
import { Events } from "server/network";
import { GAME_TICK_RATE } from "shared/core/constants";
import { ItemKind, type ItemTowerUnique, type TowerItemId } from "shared/inventory/types";
import { Mob } from "../mob/class";
import { PlayerUtility } from "shared/player/utility";
import { TowerInventoryUtility } from "./util";
import { TowerUtility } from "shared/tower/utility";
import { createSchedule } from "shared/utility/create-schedule";
import { itemDefinitions } from "shared/inventory/items";
import { mobDefinitions } from "shared/mob/definitions";
import { reuseThread } from "shared/utility/reuse-thread";
import { selectSpecificTower } from "shared/tower/selectors";
import { store } from "server/state/store";
import { targetingModules } from "shared/tower/targeting";
import { towerModules } from "./towers";
import type { ReplicatedTower } from "shared/tower/types";
import type { TowerTargeting } from "shared/tower/types";

export class Tower extends API {
	public static readonly towers = new Map<string, Tower>();

	public declare readonly id: TowerItemId;
	public declare readonly uuid: UUID;
	public declare readonly index: number;
	public declare readonly cframe: CFrame;
	public declare readonly owner: string;

	protected declare readonly key: string;
	protected declare readonly unique: ItemTowerUnique;

	protected lastAttack = 0;
	protected lastTarget: Option<Mob>;

	static {
		createSchedule({
			name: "TowerTick",
			tick: GAME_TICK_RATE,
			phase: 0,
			onTick: (delta: number): void => {
				const { towers } = this;
				for (const [_, tower] of towers) {
					reuseThread((): void => {
						tower.attackTarget(delta);
					});
				}
			},
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
		store.towerSetTargeting({ key, targeting }, { user: owner, broadcast: true });
	}

	public getReplicated(): ReplicatedTower {
		const { key } = this;
		const tower = store.getState(selectSpecificTower(key));
		if (tower === undefined) {
			throw "Tower does not exist!";
		}
		return tower;
	}

	public getTargeting(): TowerTargeting {
		const { targeting } = this.getReplicated();
		return targeting;
	}

	public getTarget(): Option<Mob> {
		const { cframe } = this;
		const position = cframe.Position;
		const replicated = this.getReplicated();
		const range = TowerUtility.getTotalRange(replicated);
		const mobs = Mob.getMobsInRadius(position, range);
		const targeting = this.getTargeting();
		const module = targetingModules[targeting];
		const target = module.getTarget(mobs);
		return target as Option<Mob>;
	}

	public attackTarget(delta: number): void {
		const { id, key, lastAttack, lastTarget } = this;
		const { kind } = itemDefinitions[id];
		const replicated = this.getReplicated();
		const damage = TowerUtility.getTotalDamage(replicated);
		const cooldown = TowerUtility.getTotalCooldown(replicated);
		const now = os.clock();
		if (now - lastAttack < cooldown) {
			return;
		}
		this.lastAttack = now;
		const currentTarget = this.getTarget();
		if (currentTarget !== lastTarget) {
			const target = currentTarget?.uuid;
			Events.tower.attack.broadcast(key, target);
		}
		this.lastTarget = currentTarget;
		if (currentTarget === undefined) {
			this.lastAttack = 0;
			return;
		}
		const { damageKind } = kind;
		const module = towerModules[id];
		const died = currentTarget.takeDamage(damage, damageKind, key);
		module?.onAttack(replicated, currentTarget);
		if (!died) {
			return;
		}
		this.addExperience(currentTarget);
	}

	public sellTower(): void {
		const { key, owner } = this;
		const tower = this.getReplicated();
		const cost = TowerUtility.getSellPrice(tower);
		store.gameAddCurrency({ amount: cost }, { user: owner, broadcast: true });
		store.towerSell({ key }, { user: owner, broadcast: true });
		this.destroy();
	}

	public upgradeTower(): void {
		const { key, owner } = this;
		store.towerUpgrade({ key }, { user: owner, broadcast: true });
	}

	public addExperience(mob: Mob): void {
		if (!mob.isDead()) {
			return;
		}
		const { owner, key, uuid } = this;
		const { id } = mob;
		const { experience: amount } = mobDefinitions[id];
		const player = PlayerUtility.getPlayer(owner);
		store.towerAddExperience({ amount: amount, key }, { broadcast: true });
		if (player === undefined) {
			return;
		}
		const slot = TowerInventoryUtility.getTowerSlot(player, uuid);
		if (slot === undefined) {
			return;
		}
		const { unique } = this.getReplicated();
		const { level, experience } = unique;
		store.inventoryPatchSlot(
			{ slot, patch: { kind: ItemKind.Tower, level, experience } },
			{ user: owner, replicate: true },
		);
	}

	public destroy(): void {
		const { towers } = Tower;
		const { key } = this;
		towers.delete(key);
	}
}
