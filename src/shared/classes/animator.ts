import { Bin } from "@rbxts/bin";
import { Option } from "@rbxts/rust-classes";
import type { t } from "@rbxts/t";

type RobloxAnimator = Instances["Animator"];

export class Animator<T extends string> {
	protected readonly animations = new Map<T, Animation>();
	protected readonly loaded = new Map<T, AnimationTrack>();
	protected readonly bin = new Bin();
	protected readonly animator: RobloxAnimator;

	protected readonly assets: { [K in T]: RBXAssetId };
	protected readonly guard: t.check<T>;

	protected playing?: AnimationTrack;
	protected stopped?: RBXScriptConnection;
	protected destroyed = false;

	public constructor(animator: RobloxAnimator, assets: { [K in T]: RBXAssetId }, guard: t.check<T>) {
		const { bin } = this;
		this.animator = animator;
		this.assets = assets;
		this.guard = guard;
		bin.add((): void => {
			const { animations, loaded, playing, stopped } = this;
			for (const [_, animation] of animations) {
				animation.Destroy();
			}
			for (const [_, track] of loaded) {
				track.Destroy();
			}
			playing?.Destroy();
			animations.clear();
			loaded.clear();
			stopped?.Disconnect();
		});
		this.initialize();
	}

	public getAnimation(id: T): Option<AnimationTrack> {
		const { loaded } = this;
		const track = loaded.get(id);
		return Option.wrap(track);
	}

	public isPlaying(id: T): boolean {
		const { playing, loaded } = this;
		const track = loaded.get(id);
		if (track === undefined) {
			return false;
		}
		return track === playing;
	}

	public isDestroyed(): boolean {
		const { destroyed } = this;
		return destroyed;
	}

	public playAnimation(id: T, transition = 0.1): void {
		const { animations, loaded, animator, assets, playing, stopped } = this;
		if (this.isDestroyed()) {
			return;
		}
		let track = loaded.get(id);
		if (track === undefined) {
			let animation = animations.get(id);
			if (animation === undefined) {
				const asset = assets[id];
				animation = new Instance("Animation");
				animation.Name = id;
				animation.AnimationId = asset;
				animation.Parent = animator;
				animations.set(id, animation);
			}
			animations.set(id, animation);
			track = animator.LoadAnimation(animation);
			loaded.set(id, track);
		}
		if (track === playing) {
			return;
		}
		playing?.Stop();
		stopped?.Disconnect();
		this.playing = undefined;
		this.stopped = undefined;
		transition = 0;
		track.Play(transition);
	}

	public stopAnimation(): void {
		const { playing, stopped } = this;
		stopped?.Disconnect();
		playing?.Stop();
		this.playing = undefined;
		this.stopped = undefined;
	}

	public fromEvent<T extends Array<unknown>>(
		event: RBXScriptSignal<(...args: T) => void>,
		callback: (...args: T) => void,
	): void {
		const { bin } = this;
		const connection = event.Connect((...args: T): void => callback(...args));
		bin.add(connection);
	}

	public initialize(): void {
		const { bin, animator } = this;
		const played = animator.AnimationPlayed.Connect((track: AnimationTrack): void => {
			const { guard } = this;
			const id = track.Name;
			if (!guard(id)) {
				return;
			}
			const stopped = track.Stopped.Once((): void => {
				const { playing } = this;
				if (playing !== track) {
					return;
				}
				this.playing = undefined;
			});
			this.playing = track;
			this.stopped = stopped;
		});
		bin.add(played);
	}

	public destroy(): void {
		const { bin } = this;
		if (this.isDestroyed()) {
			return;
		}
		bin.destroy();
		this.stopped = undefined;
		this.playing = undefined;
		this.destroyed = true;
	}
}
