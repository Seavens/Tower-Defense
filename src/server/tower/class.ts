import { Tower as API } from "shared/tower/api";
import { Events } from "server/network";
import { GAME_TICK_RATE } from "shared/core/constants";
import { ItemKind } from "shared/inventory/types";
import { Mob } from "../mob/class";
import { MobDamage } from "shared/mob/types";
import { Players } from "@rbxts/services";
import { TowerInventoryUtility } from "./utility";
import { TowerUtility } from "shared/tower/utility";
import { abilityModules } from "./modules/abilities";
import { createSchedule } from "shared/utility/functions/create-schedule";
import { itemDefinitions } from "shared/inventory";
import { mobDefinitions } from "shared/mob/definitions";
import { reuseThread } from "shared/utility/functions/reuse-thread";
import { selectSpecificTower } from "shared/tower/selectors";
import { store } from "server/state/store";
import { targetingModules } from "shared/tower/targeting";
import { towerModules } from "./modules";
import Octree from "@rbxts/octo-tree";
import type { ItemTowerUnique, TowerItemId } from "shared/inventory/types";
import type { Node } from "@rbxts/octo-tree";
import type { ReplicatedTower, TowerTargeting } from "shared/tower/types";
import type { TowerAbility } from "shared/inventory/towers/abilities/types";

export class Tower extends API {
	public static readonly towers = new Map<string, Tower>();

	protected static octree = new Octree<Tower>();

	public declare readonly id: TowerItemId;
	public declare readonly uuid: UUID;
	public declare readonly index: number;
	public declare readonly cframe: CFrame;
	public declare readonly owner: string;

	public towers: Set<Tower> = new Set();

	protected declare readonly key: string;
	protected declare readonly unique: ItemTowerUnique;

	protected lastAttack = 0;
	protected lastTarget: Option<Mob>;
	protected speedBuff = 0;

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
		Tower.updateTowersInRange();
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

	public static isTower(value: unknown): value is Tower {
		if (!typeIs(value, "table") || !("key" in value)) {
			return false;
		}
		const { towers } = this;
		const { key } = value;
		if (!typeIs(key, "string")) {
			return false;
		}
		const tower = towers.get(key);
		if (tower === undefined) {
			return false;
		}
		return tower === (value as never);
	}

	protected static updateTowersInRange(): void {
		const { towers } = this;
		for (const [, tower] of towers) {
			const { towers } = tower;
			const replicated = tower.getReplicated();
			const { position } = replicated;
			const range = TowerUtility.getTotalRange(replicated);
			const nodes = this.getTowersInRadius(position, range);
			towers.clear();
			for (const { Object: within } of nodes) {
				if (tower === within) {
					continue;
				}
				towers.add(within);
			}
		}
	}

	public getTowersInRange(): Set<Tower> {
		const { towers } = this;
		return towers;
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

	public setSpeedBuff(buff: number): void {
		this.speedBuff = math.clamp(buff, 0, 5);
	}

	public getSpeedBuff(): number {
		const { speedBuff } = this;
		return speedBuff;
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
		const { id, speedBuff } = this;

		const cooldown = TowerUtility.getTotalCooldown(replicated);
		if (os.clock() - this.lastAttack < cooldown - cooldown * speedBuff) {
			return;
		}
		this.updateLastAttackTime();

		const currentTarget = this.getTarget();
		this.broadcastAttackEvent(currentTarget);
		this.attackTargetIfPossible(currentTarget);
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

	public getTarget(targeting = this.getTargeting()): Option<Mob> {
		const { cframe } = this;
		const position = cframe.Position;
		const replicated = this.getReplicated();
		const range = TowerUtility.getTotalRange(replicated);
		const mobs = Mob.getMobsInRadius(position, range);
		const module = targetingModules[targeting];
		const target = module.getTarget(mobs);
		return target as Option<Mob>;
	}

	public useAbility(ability: TowerAbility): void {
		const replicated = this.getReplicated();
		if (!TowerUtility.isAbilityUnlocked(replicated, ability)) {
			return;
		}
		const module = abilityModules[ability];
		const target = module?.getTarget(this);
		module?.useAbility(this, target);
	}

	public destroy(): void {
		const { towers, octree } = Tower;
		const { key, node } = this;
		store.deleteStatus({}, { user: key, broadcast: true });
		octree.RemoveNode(node);
		towers.delete(key);
		Tower.updateTowersInRange();
	}

	protected addExperience(mob: Mob): void {
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

	protected updateLastAttackTime(): void {
		const now = os.clock();
		this.lastAttack = now;
	}

	protected broadcastAttackEvent(currentTarget?: Mob): void {
		if (currentTarget === undefined) {
			return;
		}
		if (currentTarget !== this.lastTarget) {
			const target = currentTarget?.uuid;
			Events.tower.attack.broadcast(this.key, target);
		}
		this.lastTarget = currentTarget;
	}

	protected attackTargetIfPossible(currentTarget: Option<Mob>): void {
		const { id } = this;
		const { damageKind } = itemDefinitions[id].kind;
		const replicated = this.getReplicated();
		const damage = TowerUtility.getTotalDamage(replicated);
		const module = towerModules[id];
		module?.onAttack(this, currentTarget);
		// !! Cleanup
		if (damageKind === MobDamage.None) {
			return;
		}
		if (currentTarget === undefined) {
			this.lastAttack = 0;
			return;
		}
		const died = currentTarget.takeDamage(damage, damageKind, this.key);
		if (died === false) {
			return;
		}
		this.addExperience(currentTarget);
	}

	protected getTargeting(): TowerTargeting {
		const { targeting } = this.getReplicated();
		return targeting;
	}
}
