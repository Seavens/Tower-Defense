import { Modding } from "@flamework/core";
import { t } from "@rbxts/t";
import { HttpService, Players } from "@rbxts/services";
import { rarityDefinitions } from "shared/definitions/rarities";
import { TowerDefinitions } from "shared/definitions/towers";
import { TowerId } from "shared/types/ids";
import { RarityId } from "shared/types/ids/rarity-id";
import { Tower } from "shared/types/objects";
import { TowerDefinition } from "shared/types/definitions";
import { generateUUID } from "./generate-uuid";

const isRange = t.strictArray(t.number, t.number);

export function GenerateTower(owner: number): Tower {

    function getTowersOfRarity(rarity: RarityId): Array<TowerId> {
        const allIds = Modding.inspect<Array<TowerId>>();
        const filtered = new Array<TowerId>();
        for (const id of allIds) {
            const definition = TowerDefinitions[id];
            if (definition.rarity !== rarity) {
                continue;
            }
            filtered.push(id);
        }
        return filtered;
    }
    
    function genRandomRarity(): RarityId {
        const randomValue = math.random();
        let cumulative = 0;
        const weights = [
            rarityDefinitions[RarityId.Rare].weight,
            rarityDefinitions[RarityId.Epic].weight,
            rarityDefinitions[RarityId.Legendary].weight,
            rarityDefinitions[RarityId.Mythical].weight,
        ]
        const rarities = [ RarityId.Rare, RarityId.Epic, RarityId.Legendary, RarityId.Mythical ];
    
        for (const index of $range(1, weights.size())) {
            cumulative += weights[index - 1];
            if (randomValue <= cumulative) {
                return rarities[index - 1];
            }
        }
    
        return RarityId.Rare;
    }

    function genTower(): TowerId {
        const rarity = genRandomRarity();
        const towers = getTowersOfRarity(rarity);
        const index = math.random(1, towers.size())
        return towers[index - 1];
    }

    function genFromRange(towerId: TowerId, key: keyof TowerDefinition<TowerId>): number {
        const tower = TowerDefinitions[towerId];
        const value = tower[key];
        if (!isRange(value)) {
            return 0;
        }
        const [min, max] = value;
        const generated = math.random() * (max - min) + min;
        return generated;
    }

    const id = genTower();
    const uuid = generateUUID();
    return {
        id,
        owner,
        original: owner,
        range: genFromRange(id, "range"),
        damage: genFromRange(id, "damage"),
        attackSpeed: genFromRange(id, "attackSpeed"),
        uuid,
        timestamp: os.time(),
    }
}