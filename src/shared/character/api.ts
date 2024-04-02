import { Animator } from "./animator";
import { BaseCharacterAnimation } from "./types";
import { Bin } from "@rbxts/bin";
import { CHARACTER_BASE_ANIMATIONS } from "shared/character/constants";
import { CharacterUtility } from "./utility";
import { Collision, setCollision } from "shared/utils/collision";
import { Players, RunService, Workspace } from "@rbxts/services";
import { isBaseCharacterAnimation } from "./types";
import type { CharacterAnimation } from "./types";

const { characters } = Workspace;

export abstract class Character {
	public readonly user: string;
	public readonly humanoid?: Humanoid;

	protected readonly bin = new Bin();
	protected readonly instance: Model;

	protected destroyed = false;

	private readonly humanoidAnimator?: Animator<BaseCharacterAnimation>;

	protected abstract readonly animator?: Animator<CharacterAnimation>;

	public constructor(user: string, rig?: Model) {
		rig ??= CharacterUtility.getCharacterRig(user).Clone();
		const server = RunService.IsServer();
		const { bin } = this;
		const humanoid = rig.FindFirstChildWhichIsA("Humanoid", true);
		const anim = rig.FindFirstChildWhichIsA("Animator", true);
		this.user = user;
		this.instance = rig;
		this.humanoid = humanoid;
		setCollision(rig, Collision.Character, true);
		const ancestry = rig.AncestryChanged.Connect((_: Instance, parent?: Instance): void => {
			if (!this.isDestroyed() || parent === characters) {
				return;
			}
			task.defer((): void => {
				if (this.isDestroyed()) {
					return;
				}
				rig!.Parent = characters;
			});
		});
		const descendant = rig.DescendantAdded.Connect((descendant: Instance): void => {
			setCollision(descendant, Collision.Character);
		});
		bin.add(ancestry);
		bin.add(descendant);
		if (server) {
			const spawn = CharacterUtility.getSpawnLocation();
			rig.Name = user;
			rig.Parent = Workspace.characters;
			rig.PivotTo(spawn);
		}
		bin.add(rig);
		if (anim === undefined) {
			return;
		}
		const animator = new Animator<BaseCharacterAnimation>(
			anim,
			CHARACTER_BASE_ANIMATIONS,
			isBaseCharacterAnimation,
		);
		this.humanoidAnimator = animator;
		this.initialize();
	}

	public getInstance(): Model {
		const { instance } = this;
		return instance;
	}

	public getCFrame(): CFrame {
		const { instance } = this;
		const cframe = instance.GetPivot();
		return cframe;
	}

	public getHealth(): number {
		const { humanoid } = this;
		if (humanoid === undefined) {
			return math.huge;
		}
		const health = humanoid.Health;
		return health;
	}

	public isHumanoid(): this is Character & { humanoid: Humanoid } {
		const { humanoid } = this;
		return humanoid !== undefined;
	}

	public isDead(): boolean {
		if (this.isDestroyed()) {
			return true;
		}
		const { humanoid } = this;
		const health = humanoid?.Health ?? 0;
		return health <= 0;
	}

	public isAlive(): boolean {
		return !this.isDead();
	}

	public isPlayer(): boolean {
		const { user } = this;
		const player = Players.FindFirstChild(user);
		if (player === undefined) {
			return false;
		}
		return true;
	}

	public isDestroyed(): boolean {
		const { destroyed } = this;
		return destroyed;
	}

	public initialize(): void {
		const { instance, humanoid, humanoidAnimator } = this;
		const client = RunService.IsClient();
		if ((this.isPlayer() && !client) || humanoid === undefined || humanoidAnimator === undefined) {
			return;
		}
		const scale = instance.GetScale();
		humanoidAnimator.fromEvent(humanoid.Running, (speed: number): void => {
			speed /= scale;
			const direction = humanoid.MoveDirection;
			const magnitude = direction.Magnitude;
			if (speed <= 1 || magnitude <= 1e-1) {
				humanoidAnimator.stopAnimation();
				return;
			}
			humanoidAnimator.playAnimation(BaseCharacterAnimation.Walk);
		});
		humanoidAnimator.fromEvent(humanoid.Jumping, (active: boolean): void => {
			if (!active) {
				return;
			}
			humanoidAnimator.playAnimation(BaseCharacterAnimation.Jump);
		});
		humanoidAnimator.fromEvent(humanoid.Swimming, (speed: number): void => {
			if (speed <= 0) {
				humanoidAnimator.stopAnimation();
				return;
			}
			humanoidAnimator.playAnimation(BaseCharacterAnimation.Walk);
		});
		// humanoidAnimator.fromEvent(humanoid.Climbing, (speed: number): void => {
		// 	speed /= scale;
		// 	humanoidAnimator.playAnimation(BaseCharacterAnimation.Climbing);
		// });
	}

	public destroy(): void {
		if (this.isDestroyed()) {
			return;
		}
		const { bin } = this;
		bin.destroy();
		this.destroyed = true;
	}

	public abstract getAnimator(): Option<Animator<CharacterAnimation>>;
}
