import { Tower as API } from "shared/tower/api";
import { Events } from "server/network";
import { GAME_TICK_RATE } from "shared/core/constants";
import { ItemKind, type ItemTowerUnique, type TowerItemId } from "shared/inventory/types";
import { Mob } from "../mob/class";
import { MobDamage } from "shared/mob/types";
import { Players } from "@rbxts/services";
import { TowerInventoryUtility } from "./utility";
import { TowerUtility } from "shared/tower/utility";
import { createSchedule } from "shared/utility/functions/create-schedule";
import { itemDefinitions } from "shared/inventory";
import { mobDefinitions } from "shared/mob/definitions";
import { reuseThread } from "shared/utility/functions/reuse-thread";
import { selectSpecificTower } from "shared/tower/selectors";
import { store } from "server/state/store";
import { targetingModules } from "shared/tower/targeting";
import Octree from "@rbxts/octo-tree";
import type { Node } from "@rbxts/octo-tree";
import type { ReplicatedTower } from "shared/tower/types";
import type { TowerTargeting } from "shared/tower/types";

export class Tower extends API {
	public static readonly towers = new Map<string, Tower>();

	protected static octree = new Octree<Tower>();

	public declare readonly id: TowerItemId;
	public declare readonly uuid: UUID;
	public declare readonly index: number;
	public declare readonly cframe: CFrame;
	public declare readonly owner: string;

	public towersInRange: Set<Tower> = new Set();

	protected declare readonly key: string;
	protected declare readonly unique: ItemTowerUnique;

	protected lastAttack = 0;
	protected lastTarget: Option<Mob>;

	protected readonly node: Node<Tower>;

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
		const { towers, octree } = Tower;

		const { position } = tower;
		const node = octree.CreateNode(position, this);
		this.node = node;
		const { key } = this;
		towers.set(key, this);
	}

	public static getTowersInRadius(position: Vector3, radius: number): Array<Node<Tower>> {
		const { octree } = this;
		const towers = octree.SearchRadius(position, radius);
		return towers;
	}

	public static getTower(key: string): Option<Tower> {
		const { towers } = this;
		return towers.get(key);
	}

	public updateTowersInRange(): void {
		const replicated = this.getReplicated();
		const def = itemDefinitions[replicated.id];
		const { kind } = def;

		const towersInRange = Tower.getTowersInRadius(this.cframe.Position, kind.range);
		this.towersInRange = new Set<Tower>(towersInRange.map((node) => node.Object));
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

	public attackTarget(delta: number): void {
		const replicated = this.getReplicated();
		const def = itemDefinitions[replicated.id];
		const { kind } = def;

		const damage = TowerUtility.getTotalDamage(replicated);
		const range = TowerUtility.getTotalRange(replicated);
		const cooldown = TowerUtility.getTotalCooldown(replicated);
		if (os.clock() - this.lastAttack < cooldown) {
			return;
		}
		this.updateLastAttackTime();

		if (kind.damageKind === MobDamage.None) {
			const towersInRange = Tower.getTowersInRadius(this.cframe.Position, kind.range);
			for (const node of towersInRange) {
				const tower = node.Object;
				const target = tower.getReplicated();
				let _damage = TowerUtility.getTotalDamage(target);
				let _range = TowerUtility.getTotalRange(target);
				let _cooldown = TowerUtility.getTotalCooldown(target);

				_damage += _damage * damage;
				_range += _range * range;
				_cooldown += _cooldown * cooldown;
				warn(_damage, _range, _cooldown);
			}
		} else {
			const currentTarget = this.getTarget();
			if (currentTarget === undefined) return;
			this.broadcastAttackEvent(currentTarget);
			this.attackTargetIfPossible(currentTarget);
		}
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

	public destroy(): void {
		const { towers, octree } = Tower;
		const { key, node } = this;
		octree.RemoveNode(node);
		towers.delete(key);
		this.updateTowersInRange();
	}

	private addExperience(mob: Mob): void {
		if (!mob.isDead()) {
			return;
		}
		const { owner, key, uuid } = this;
		const { id } = mob;
		const { experience: amount } = mobDefinitions[id];
		const player = Players.FindFirstChild(owner);
		store.towerAddExperience({ amount: amount, key }, { broadcast: true });
		if (player === undefined || !player.IsA("Player")) {
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

	private updateLastAttackTime(): void {
		const now = os.clock();
		this.lastAttack = now;
	}

	private broadcastAttackEvent(currentTarget: Mob): void {
		if (currentTarget !== this.lastTarget) {
			const target = currentTarget?.uuid;
			Events.tower.attack.broadcast(this.key, target);
		}
		this.lastTarget = currentTarget;
	}

	private attackTargetIfPossible(currentTarget: Mob): void {
		if (currentTarget === undefined) {
			this.lastAttack = 0;
			return;
		}
		const { id } = this;
		const { damageKind } = itemDefinitions[id].kind;

		const { unique } = this.getReplicated();
		const { damage } = unique;

		const died = currentTarget.takeDamage(damage, damageKind, this.key);
		if (died === false) {
			return;
		}
		this.addExperience(currentTarget);
	}

	private getTargeting(): TowerTargeting {
		const { targeting } = this.getReplicated();
		return targeting;
	}

	private getTarget(): Option<Mob> {
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
}
