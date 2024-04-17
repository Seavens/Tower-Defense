import { LevelUtility } from "shared/players/profile/utility";
import { MAX_TOWER_LEVEL } from "./constants";
import { createProducer } from "@rbxts/reflex";
import { produce } from "@rbxts/immut";
import type { Draft } from "@rbxts/immut/src/types-external";
import type { ReplicatedTower } from "./types";
import type {
	TowerActions,
	TowerAddExperience,
	TowerPlace,
	TowerSell,
	TowerSetTargeting,
	TowerUpgrade,
} from "./actions";
import type { UserMetadata } from "shared/state/replication/metadata";

export interface TowerState {
	readonly placed: Map<string, Readonly<ReplicatedTower>>; // Map<{{Tower UUID}_{Tower Index}}, Readonly<ReplicatedTower>>;
}

const towerState: TowerState = {
	placed: new Map<string, Readonly<ReplicatedTower>>(),
};

export const towerSlice = createProducer<TowerState, TowerActions<TowerState>>(towerState, {
	towerPlace: (
		state: TowerState,
		{ id, uuid, index, key, position, targeting, unique }: TowerPlace,
		{ user }: UserMetadata,
	): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const tower: ReplicatedTower = {
				id,
				uuid,
				position,
				owner: user,
				upgrades: 0,
				index,
				targeting,
				key,
				unique,
			};
			placed.set(key, tower);
		}),
	towerSell: (state: TowerState, { key }: TowerSell, { user }: UserMetadata): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const tower = placed.get(key);
			const owner = tower?.owner;
			if (tower === undefined || owner !== user) return;

			placed.delete(key);
		}),
	towerSetTargeting: (state: TowerState, { key, targeting }: TowerSetTargeting, { user }: UserMetadata): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const tower = placed.get(key);
			const owner = tower?.owner;
			if (tower === undefined || owner !== user) return;

			tower.targeting = targeting;
		}),
	towerUpgrade: (state: TowerState, { key }: TowerUpgrade, { user }: UserMetadata): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const tower = placed.get(key);
			const owner = tower?.owner;
			if (tower === undefined || owner !== user) return;

			tower.upgrades += 1;
		}),
	towerAddExperience: (state: TowerState, { key, amount }: TowerAddExperience): TowerState =>
		produce(state, ({ placed }: Draft<TowerState>): void => {
			const tower = placed.get(key);
			if (tower === undefined) return;

			if (tower.unique.level >= 100) {
				tower.unique.experience = 0;
				return;
			}

			const { level } = tower.unique;
			const [newLevel, newExperience] = LevelUtility.calculateIncrease(level, amount, true);
			tower.unique.level = math.min(newLevel, MAX_TOWER_LEVEL);
			tower.unique.experience += newExperience;

			if (tower.unique.level >= 100) {
				tower.unique.experience = 0;
				return;
			}
		}),
});
