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
			let ended: RBXScriptConnection;
			let stopped: RBXScriptConnection;
			// eslint-disable-next-line prefer-const
			ended = this.sound.Ended.Once(() => {
				this.destroy();
				resolve();
				ended.Disconnect();
			});
			// eslint-disable-next-line prefer-const
			stopped = this.sound.Stopped.Once((): void => {
				this.destroy();
				resolve();
				stopped.Disconnect();
			});
			this.sound.Volume = volume;
			this.play();
		});
	}

	public playOnRemove(volume = 0.8): void {
		this.sound.Volume = volume;
		this.sound.PlayOnRemove = true;
	}

	public play(volume = 0.8): void {
		this.sound.Volume = volume;
		this.sound.Play();
	}

	public destroy(): void {
		this.sound.Destroy();
	}
}
