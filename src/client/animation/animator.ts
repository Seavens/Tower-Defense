import { Bin } from "@rbxts/bin";
import { Dictionary } from "@rbxts/sift";
import { Signal } from "@rbxts/beacon";
import { t } from "@rbxts/t";
import type { CharacterRigR6 } from "@rbxts/character-promise";

type RBXAnimator = Instances["Animator"];

const random = new Random();

export class Animator<T extends string> {
	protected static readonly animators = new Map<Model, Animator<string>>();

	public readonly played = new Signal<[key: T, track: AnimationTrack]>();

	protected readonly animations: { [K in T]: Array<RBXAssetId> };
	protected readonly loaded = new Map<T, Array<AnimationTrack>>();
	protected readonly animator: RBXAnimator;
	protected readonly model: Model;
	protected readonly bin = new Bin();
	protected readonly guard: t.check<T>;

	protected playing: Option<AnimationTrack>;
	protected stopped: Option<RBXScriptConnection>;

	public constructor(model: Model, animations: { [K in T]: Array<RBXAssetId> }) {
		const animator = model.FindFirstChildWhichIsA("Animator", true);
		if (animator === undefined) {
			throw `No animator found on ${model.GetFullName()}!`;
		}
		const { animators } = Animator;
		const { played, bin } = this;
		const keys = new Array<T>();
		// eslint-disable-next-line roblox-ts/no-array-pairs
		for (const [key] of pairs(animations)) {
			keys.push(key as T);
		}
		const guard = t.literal(...keys);
		this.animations = table.clone(animations);
		this.animator = animator;
		this.model = model;
		this.guard = guard;
		const connection = animator.AnimationPlayed.Connect((track: AnimationTrack): void => {
			const key = track.Name;
			if (!guard(key)) {
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
			played.FireDeferred(key, track);
		});
		bin.add(connection);
		animators.set(model, this);
	}

	public static getAnimator<T extends string>(character: CharacterRigR6): Option<Animator<T>> {
		const { animators } = this;
		return animators.get(character) as Option<Animator<T>>;
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
		const { animations, loaded, guard, playing } = this;
		if (!guard(key)) {
			throw `Invalid key given, expected ${Dictionary.keys(animations).join(", ")} got ${key}.`;
		}
		let tracks = loaded.get(key);
		if (tracks === undefined) {
			tracks = this.loadAnimation(key);
		}
		if (playing !== undefined && tracks.includes(playing)) {
			return playing;
		}
		const size = tracks.size();
		if (size <= 0) {
			return undefined!;
		}
		index ??= random.NextInteger(1, size) - 1;
		const track = tracks[index];
		this.stopAnimation();
		this.playing = track;
		track.Play();
		return track;
	}

	public stopAnimation(key?: T, index = 0): void {
		const { playing, loaded } = this;
		if (key !== undefined) {
			const tracks = loaded.get(key);
			const track = tracks?.[index];
			if (playing !== track) {
				return;
			}
		}
		playing?.Stop();
		this.playing = undefined;
	}

	public connectAnimation(
		key: T,
		index = 0,
		marker: string,
		callback: (param?: string) => void,
	): RBXScriptConnection {
		const { loaded, bin } = this;
		let tracks = loaded.get(key);
		if (tracks === undefined) {
			tracks = this.loadAnimation(key);
		}
		const track = tracks[index];
		if (track === undefined) {
			throw `No track found at index ${index}.`;
		}
		const connection = track.GetMarkerReachedSignal(marker).Connect(callback);
		bin.add(connection);
		return connection;
	}

	public destroy(): void {
		const { animators } = Animator;
		const { played, loaded, model, bin, stopped } = this;
		for (const [, tracks] of loaded) {
			for (const track of tracks) {
				track.Destroy();
			}
			tracks.clear();
		}
		played.Destroy();
		stopped?.Disconnect();
		bin.destroy();
		animators.delete(model);
		this.stopped = undefined;
		this.playing = undefined;
	}

	protected loadAnimation(key: T): Array<AnimationTrack> {
		const { animations, loaded, animator, bin } = this;
		let tracks = loaded.get(key);
		if (tracks !== undefined) {
			return tracks;
		}
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
		return tracks;
	}
}
