import { Bin } from "@rbxts/bin";
import { TowerDefinitions } from "shared/definitions/towers";
import { AttackId } from "shared/types/ids/attack-id";
import { TowerId } from "shared/types/ids/tower-id";
import { DamageKind } from "shared/types/kinds/damage-kind"

export abstract class Tower {
    public readonly index: number;
    public readonly id: TowerId;
    public readonly kind?: DamageKind;
    public readonly damage: [number, number];
    public readonly range: [number, number];
    public readonly attackSpeed: [number, number];
    public readonly count: number;


    protected readonly bin = new Bin();
    protected readonly statuses = new Map<AttackId, number>();

    public constructor(index: number, id: TowerId) {
        const { damage, range, attackSpeed, kind, count } = TowerDefinitions[id];
        this.index = index;
        this.id = id;
        this.damage = [damage[0], damage[1]];
        this.range = [range[0], range[1]];
        this.attackSpeed = [attackSpeed[0], attackSpeed[1]];
        this.kind = kind;
        this.count = count;
    }

}