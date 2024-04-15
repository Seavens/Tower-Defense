import { Bin } from "@rbxts/bin";
import { Dictionary } from "@rbxts/sift";
import { t } from "@rbxts/t";

export class SoundEmitter<T extends string> {
	protected readonly sounds: { [K in T]: Array<RBXAssetId> };
	protected readonly loaded = new Map<T, Array<Sound>>();
	protected readonly playing = new Map<T, Array<Sound>>();
	protected readonly cache = new Set<Sound>();
	protected readonly bin = new Bin();
	protected readonly guard: t.check<T>;
	protected readonly container: Instance;

	public constructor(container: Instance, sounds: { [K in T]: Array<RBXAssetId> }) {
		const { bin } = this;
		const guard: t.check<T> = t.literal(...Dictionary.keys(sounds));
		this.sounds = sounds;
		this.guard = guard;
		this.container = container;
		bin.add((): void => {
			const { cache } = this;
			for (const instance of cache) {
				instance.Destroy();
			}
			cache.clear();
		});
	}

	public getSound(key: T, index = 0): Sound {
		const { loaded } = this;
		let sounds = loaded.get(key);
		if (sounds === undefined) {
			sounds = this.loadSounds(key);
		}
		index = math.clamp(index, 0, sounds.size() - 1);
		return sounds[index];
	}

	public playSound(key: T, index = 0, volume = 1): Sound {
		const { sounds, loaded, playing, bin, guard } = this;
		if (!guard(key)) {
			throw `Invalid key given, expected ${Dictionary.keys(sounds).join(", ")} got ${key}.`;
		}
		let active = playing.get(key);
		if (active === undefined) {
			active = new Array<Sound>();
			playing.set(key, active);
		}
		let instances = loaded.get(key);
		if (instances === undefined) {
			instances = this.loadSounds(key);
		}
		let sound = instances[index];
		if (active.includes(sound)) {
			sound = this.createSound(key, index);
		}
		sound.Volume = volume;
		sound.Play();
		const length = sound.TimeLength;
		if (length <= 0) {
			return sound;
		}
		active.push(sound);
		const ended = sound.Ended.Once((): void => {
			const index = active.indexOf(sound);
			active.remove(index);
		});
		const stopped = sound.Stopped.Once((): void => {
			const index = active.indexOf(sound);
			active.remove(index);
		});
		bin.add(ended);
		bin.add(stopped);
		return sound;
	}

	public stopSound(key: T, index = 0): void {
		const { playing } = this;
		const sounds = playing.get(key);
		if (sounds === undefined) {
			return;
		}
		const sound = sounds[index];
		sound.Stop();
	}

	public destroy(): void {
		const { loaded, cache, bin, playing } = this;
		for (const [, sounds] of loaded) {
			for (const sound of sounds) {
				sound.Destroy();
			}
			sounds.clear();
		}
		loaded.clear();
		for (const sound of cache) {
			sound.Destroy();
		}
		cache.clear();
		for (const [, sounds] of playing) {
			for (const sound of sounds) {
				sound.Destroy();
			}
			sounds.clear();
		}
		playing.clear();
		bin.destroy();
	}

	protected createSound(key: T, index = 0): Sound {
		const { sounds, loaded, playing, cache, bin, container } = this;
		let instances = loaded.get(key);
		const running = playing.get(key);
		const ids = sounds[key];
		if (instances === undefined) {
			instances = this.loadSounds(key);
		}
		let sound = instances[index];
		if (running !== undefined && !running.includes(sound)) {
			return sound;
		}
		const id = ids[index];
		sound = new Instance("Sound");
		sound.SoundId = id;
		sound.Name = key;
		sound.Parent = container;
		const ended = sound.Ended.Once((): void => {
			cache.delete(sound);
			task.defer((): void => {
				sound.Destroy();
			});
		});
		const stopped = sound.Stopped.Once((): void => {
			cache.delete(sound);
			task.defer((): void => {
				sound.Destroy();
			});
		});
		cache.add(sound);
		bin.add(ended);
		bin.add(stopped);
		return sound;
	}

	protected loadSounds(key: T): Array<Sound> {
		const { sounds, loaded, bin, container } = this;
		const instances = new Array<Sound>();
		const ids = sounds[key];
		for (const id of ids) {
			const sound = new Instance("Sound");
			sound.Name = key;
			sound.SoundId = id;
			sound.Parent = container;
			instances.push(sound);
			bin.add(sound);
		}
		loaded.set(key, instances);
		return instances;
	}
}
