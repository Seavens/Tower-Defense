import { Bin } from "@rbxts/bin";
import { GAME_TIMESTEP, INTERPOLATION_SMOOTHNESS } from "shared/core/core-constants";
import { MobStatus } from "./types";
import { getMapWaypoints } from "shared/map/utility";
import { mobDefinitions } from "./mobs";
import { statusDefinitions } from "./statuses";
import type { MobDamage, MobId } from "./types";

export abstract class Mob {
	public readonly index: number;
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

	public constructor(index: number, id: MobId) {
		const waypoints = getMapWaypoints();
		const { health } = mobDefinitions[id];
		this.index = index;
		this.id = id;
		this.waypoints = waypoints;
		this.max = health;
		this.health = health;
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
		this.waypoints = getMapWaypoints();
		this.calculateDuration();
	}

	public applyStatus(status: MobStatus, duration: number): void {
		const { statuses } = this;
		const timestamp = os.clock() + duration;
		statuses.set(status, timestamp);
		this.onStatus(status, duration, true);
		// warn(status, "Added");
	}

	public removeStatus(status: MobStatus): void {
		const { statuses } = this;
		statuses.delete(status);
		this.onStatus(status, 0, false);
		// warn(status, "Removed");
	}

	public takeDamage(damage: number, kind: MobDamage, tower?: string): void {
		if (damage <= 0) {
			return;
		}
		const { id, max, health } = this;
		const { resistances } = mobDefinitions[id];
		if (resistances.includes(kind)) {
			warn(this.index, "|", "Resisted damage.");
			return;
		}
		this.attacker ??= tower;
		warn(this.index, "|", health, health - damage);
		const value = math.clamp(health - damage, 0, max);
		if (value <= 0) {
			this.onDied(tower);
			this.destroy();
			return;
		}
		this.onDamage(damage, kind);
		this.health = value;
	}

	public forceKill(): void {
		if (this.isDead() || this.isDestroyed()) {
			warn(this.index, "|", "Failed to forcekill.");
			return;
		}
		warn(this.index, "|", "Forcekilled");
		this.onDied(this.attacker);
		this.destroy();
	}

	public start(): void {
		const waypoints = getMapWaypoints();
		const final = waypoints.size();
		this.waypoints = waypoints;
		this.nextWaypoint(1, final);
		this.started = true;
	}

	public onTick(delta: number): void {
		if (!this.isStarted()) {
			return;
		}
		if (this.isDead()) {
			// warn(this.index, "|", "Dead past tick.");
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
		this.onMovement();
	}

	public destroy(): void {
		if (this.isDestroyed()) {
			// warn(this.index, "|", "Failed to destroy.");
			return;
		}
		// warn(this.index, "|", "Successfully destroyed.");
		const { bin } = this;
		bin.destroy();
		this.destroyed = true;
		this.started = false;
	}

	public abstract onDied(tower?: string): void;
	public abstract onDamage(damage: number, kind: MobDamage): void;
	public abstract onMovement(): void;
	public abstract onWaypoint(index: number): void;
	public abstract onStatus(status: MobStatus, duration: number, added: boolean): void;
	public abstract onEnd(): void;
	public abstract onResync?(): void;
}
