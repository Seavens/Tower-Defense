import { Bin } from "@rbxts/bin";

export class SoundEffect {
	private sound: Sound;
	private bin = new Bin();

	public constructor(container: Instance, soundId: RBXAssetId) {
		this.sound = new Instance("Sound");
		this.sound.SoundId = soundId;
		this.sound.Parent = container;
		this.bin.add(this.sound);
	}

	public play(volume = 0.8): void {
		this.sound.Volume = volume;
		this.sound.Play();
		const thread = task.delay(this.sound.TimeLength, (): void => this.destroy());
		this.bin.add(thread);
	}

	public stop(): void {
		this.sound.Stop();
	}

	public destroy(): void {
		this.sound.Destroy();
	}
}
