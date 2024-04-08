import { Bin } from "@rbxts/bin";
import { Dictionary } from "@rbxts/sift";
import { t } from "@rbxts/t";

type RBXAnimator = Instances["Animator"];

export class Animator<T extends string> {
	protected readonly animations: { [K in T]: Array<RBXAssetId> };
	protected readonly loaded = new Map<T, Array<AnimationTrack>>();
	protected readonly animator: RBXAnimator;
	protected readonly bin = new Bin();
	protected readonly guard: t.check<T>;

	protected playing: Option<AnimationTrack>;
	protected stopped: Option<RBXScriptConnection>;

	public constructor(model: Model, animations: { [K in T]: Array<RBXAssetId> }) {
		const animator = model.FindFirstChildWhichIsA("Animator", true);
		if (animator === undefined) {
			throw `No animator found on ${model.GetFullName()}!`;
		}
		const { bin } = this;
		const keys = new Array<T>();
		// eslint-disable-next-line roblox-ts/no-array-pairs
		for (const [key] of pairs(animations)) {
			keys.push(key as T);
		}
		const guard = t.literal(...keys);
		this.animations = table.clone(animations);
		this.animator = animator;
		this.guard = guard;
		const connection = animator.AnimationPlayed.Connect((track: AnimationTrack): void => {
			const name = track.Name;
			if (!guard(name)) {
				return;
			}
			let { stopped } = this;
			stopped?.Disconnect();
			stopped = track.Stopped.Once((): void => {
				const { playing, stopped } = this;
				stopped?.Disconnect();
				if (playing !== track) {
					return;
				}
				this.playing = undefined;
			});
			this.stopped = stopped;
			this.playing = track;
		});
		bin.add(connection);
	}

	public isPlaying(key: T): boolean {
		const { playing } = this;
		const name = playing?.Name;
		return name === key;
	}

	public getPlaying(): Option<AnimationTrack> {
		const { playing } = this;
		return playing;
	}

	public getAnimation(key: T, index = 0): Option<AnimationTrack> {
		const { loaded } = this;
		const tracks = loaded.get(key);
		if (tracks === undefined) {
			return undefined;
		}
		const track = tracks[index];
		return track;
	}

	public playAnimation(key: T, index?: number): AnimationTrack {
		const { animations, loaded, animator, bin, guard, playing } = this;
		if (!guard(key)) {
			throw `Invalid key given, expected ${Dictionary.keys(animations).join(", ")} got ${key}.`;
		}
		let tracks = loaded.get(key);
		if (tracks === undefined) {
			const ids = animations[key];
			tracks = new Array<AnimationTrack>();
			for (const id of ids) {
				const animation = new Instance("Animation");
				animation.Name = key;
				animation.AnimationId = id;
				animation.Parent = animator;
				bin.add(animation);
				const track = animator.LoadAnimation(animation);
				tracks.push(track);
			}
			loaded.set(key, tracks);
		}
		if (playing !== undefined && tracks.includes(playing)) {
			return playing;
		}
		const size = tracks.size();
		if (size <= 0) {
			return undefined!;
		}
		index ??= math.random(1, size) - 1;
		const track = tracks[index];
		this.stopAnimation();
		this.playing = track;
		track.Play();
		return track;
	}

	public stopAnimation(): void {
		const { playing } = this;
		playing?.Stop();
		this.playing = undefined;
	}

	public destroy(): void {
		const { loaded, bin, stopped } = this;
		for (const [, tracks] of loaded) {
			for (const track of tracks) {
				track.Destroy();
			}
			tracks.clear();
		}
		stopped?.Disconnect();
		bin.destroy();
		this.stopped = undefined;
		this.playing = undefined;
	}
}
