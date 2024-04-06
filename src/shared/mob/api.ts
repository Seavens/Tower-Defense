import { Bin } from "@rbxts/bin";
import { GAME_TIMESTEP, INTERPOLATION_SMOOTHNESS } from "shared/core/constants";
import { MapUtility } from "shared/map/utility";
import { MobStatus } from "./types";
import { Workspace } from "@rbxts/services";
import { mobDefinitions } from "./mobs";
import { statusDefinitions } from "./statuses";
import type { MobDamage, MobData, MobId } from "./types";

export abstract class Mob {
	public readonly uuid: UUID;
	public readonly id: MobId;

	protected readonly bin = new Bin();
	protected readonly statuses = new Map<MobStatus, number>();
	protected readonly max: number;

	protected waypoints: Array<BasePart>;

	protected health: number;
	protected target = 0;
	protected current = 0;
	protected final = 0;
	protected elapsed = 0;
	protected duration = 1e10;
	protected destroyed = false;
	protected last = CFrame.identity;
	protected started = false;
	protected attacker: Option<string>;

	public constructor(uuid: UUID, id: MobId) {
		const waypoints = MapUtility.getMapWaypoints();
		const { health } = mobDefinitions[id];
		this.uuid = uuid;
		this.id = id;
		this.waypoints = waypoints;
		this.max = health;
		this.health = health;
	}

	public setAlpha(alpha: number, delta = 0): void {
		this.calculateDuration();
		const { duration } = this;
		const elapsed = alpha * duration;
		this.elapsed = math.min(elapsed + delta, duration);
	}

	public setElapsed(delta: number): void {
		this.calculateDuration();
		const { duration } = this;
		const elapsed = delta;
		this.elapsed = math.min(elapsed, duration);
	}

	public getCFrame(): CFrame {
		const { current, target, waypoints, last } = this;
		const a = waypoints[current - 1].GetPivot();
		const b = waypoints[target - 1].GetPivot();
		const alpha = this.getAlpha();
		const cframe = a.Lerp(b, math.clamp(alpha, 0, 1));
		const interpolated = last.Lerp(cframe, INTERPOLATION_SMOOTHNESS);
		this.last = interpolated;
		return interpolated;
	}

	public getAlpha(): number {
		const { elapsed, duration } = this;
		const alpha = math.clamp(elapsed / duration, 0, 1);
		return alpha;
	}

	public getWaypoints(): Array<BasePart> {
		const { waypoints } = this;
		return waypoints;
	}

	public getHealth(): number {
		const { health } = this;
		return health;
	}

	public isDead(): boolean {
		const { health, destroyed } = this;
		return destroyed || health <= 0;
	}

	public isAlive(): boolean {
		return !this.isDead();
	}

	public isStarted(): boolean {
		const { started } = this;
		return started;
	}

	public isDestroyed(): boolean {
		const { destroyed } = this;
		return destroyed;
	}

	public calculateDuration(): void {
		if (this.isDead()) {
			this.duration = 1e10;
			return;
		}
		const { id, waypoints, target, current } = this;
		const { speed } = mobDefinitions[id];
		const a = waypoints[current - 1];
		const b = waypoints[target - 1];
		if (a === undefined || b === undefined || a === b) {
			this.duration = 1e10;
			return;
		}
		const direction = a.Position.sub(b.Position);
		const distance = direction.Magnitude;
		const duration = distance / speed;
		this.duration = duration;
	}

	public nextWaypoint(current: number, final: number): void {
		const target = current + 1;
		this.current = math.clamp(current, 1, final);
		this.target = math.clamp(target, current, final);
		this.final = math.clamp(final, current, math.huge);
		this.elapsed = 0;
		this.waypoints = MapUtility.getMapWaypoints();
		this.calculateDuration();
	}

	public applyStatus(status: MobStatus, duration: number): void {
		const { statuses } = this;
		const timestamp = os.clock() + duration;
		statuses.set(status, timestamp);
		this.onStatus(status, duration, true);
	}

	public removeStatus(status: MobStatus): void {
		const { statuses } = this;
		statuses.delete(status);
		this.onStatus(status, 0, false);
	}

	public takeDamage(damage: number, kind: MobDamage, tower?: string): boolean {
		if (damage <= 0) {
			return false;
		}
		const { id, max, health } = this;
		const { resistances } = mobDefinitions[id];
		if (resistances.includes(kind)) {
			return false;
		}
		this.attacker ??= tower;
		const value = math.clamp(health - damage, 0, max);
		if (value <= 0) {
			this.onDied(tower);
			this.destroy();
			return true;
		}
		this.onDamage(damage, kind);
		this.health = value;
		return false;
	}

	public forceKill(): void {
		if (this.isDead() || this.isDestroyed()) {
			return;
		}
		this.onDied(this.attacker);
		this.destroy();
	}

	public serialize(): MobData {
		const { id, health, current, statuses } = this;
		const alpha = this.getAlpha();
		const timestamp = Workspace.GetServerTimeNow();
		const data: MobData = {
			id,
			health,
			current,
			timestamp,
			alpha,
			statuses,
		};
		return data;
	}

	public start(current = 1): void {
		const waypoints = MapUtility.getMapWaypoints();
		const final = waypoints.size();
		this.waypoints = waypoints;
		this.nextWaypoint(current, final);
		this.setAlpha(0);
		this.started = true;
	}

	public onTick(delta: number): void {
		if (!this.isStarted()) {
			return;
		}
		if (this.isDead()) {
			this.onDied(this.attacker);
			this.destroy();
			return;
		}
		const { statuses, target, current, final } = this;
		let total = 1;
		for (const [status, timestamp] of statuses) {
			const now = os.clock();
			if (timestamp <= now) {
				this.removeStatus(status);
				continue;
			}
			const { speed } = statusDefinitions[status];
			if (status === MobStatus.Frozen) {
				total = 0;
				break;
			}
			total += speed;
		}
		total = math.clamp(total, 0, math.huge);
		if (current >= final) {
			this.onEnd();
			this.destroy();
			return;
		}
		this.elapsed += delta * GAME_TIMESTEP * total;
		const alpha = this.getAlpha();
		if (alpha >= 1) {
			this.nextWaypoint(target, final);
			this.onResync?.();
		}
		this.onMovement(delta);
	}

	public destroy(): void {
		if (this.isDestroyed()) {
			return;
		}
		const { bin } = this;
		bin.destroy();
		this.destroyed = true;
		this.started = false;
	}

	public abstract onDied(tower?: string): void;
	public abstract onDamage(damage: number, kind?: MobDamage): void;
	public abstract onMovement(delta: number): void;
	public abstract onWaypoint(index: number): void;
	public abstract onStatus(status: MobStatus, duration: number, added: boolean): void;
	public abstract onEnd(): void;
	public abstract onResync?(): void;
}
