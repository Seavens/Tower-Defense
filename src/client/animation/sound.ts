import { Bin } from "@rbxts/bin";
import { number } from "@rbxts/react/src/prop-types";

export class SoundEffect {
	private sound: Sound;

	public constructor(container: Instance, soundId: RBXAssetId) {
		this.sound = new Instance("Sound");
		this.sound.SoundId = soundId;
		this.sound.Parent = container;
	}
	public stop(): void {
		this.sound.Stop();
	}

	public async destroyAfterPlay(volume = 0.8): Promise<void> {
		return new Promise((resolve) => {
			this.sound.Ended.Connect(() => {
				this.destroy();
				resolve();
			});
			this.play();
			this.sound.Volume = volume;
		});
	}

	public playOnRemove(volume = 0.8): void {
		this.sound.Volume = volume;
		this.sound.PlayOnRemove = true;
	}

	private play(volume = 0.8): void {
		this.sound.Volume = volume;
		this.sound.Play();
	}

	private destroy(): void {
		this.sound.Destroy();
	}
}
