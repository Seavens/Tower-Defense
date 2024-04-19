import { ASSET_IDS } from "shared/assets/constants";
import { Collision, setCollision } from "shared/utility/collision";
import { Flamework, Modding } from "@flamework/core";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { SoundEmitter } from "shared/assets/sound";
import { TowerUtility } from "shared/tower/utility";
import { TowerVisual } from "shared/tower/types";
import { params } from "../utility";
import type { Bin } from "@rbxts/bin";
import type { Mob } from "client/mob/class";
import type { ReplicatedTower } from "shared/tower/types";
import type { TowerVisualModule } from ".";

const { assets } = ReplicatedStorage;
const { effects } = assets;

type Sounds = "WhooshSuction" | "ElectricSpark" | "LightningFlashes" | "SilentGlitcher";

const soundNames = Modding.inspect<Array<Sounds>>();

const guard = Flamework.createGuard<
	BasePart & {
		blue: ParticleEmitter;
		green: ParticleEmitter;
		yellow: ParticleEmitter;
	}
>();
const prefab = effects.FindFirstChild(TowerVisual.Neutron);

const info = new TweenInfo(0.5, Enum.EasingStyle.Exponential, Enum.EasingDirection.Out, 0, false, 2.5);

const { debris } = Workspace;

export const buffVisual: TowerVisualModule<TowerVisual.Buff> = {
	id: TowerVisual.Buff,
	duration: 4,

	onEffect: (bin: Bin, model: Model, target: Option<Mob>, tower: ReplicatedTower): void => {
		if (prefab === undefined || !guard(prefab) || target === undefined) {
			return;
		}
		const instance = target.getInstance();
		const pivot = instance.GetPivot();
		const point = pivot.Position;
		const origin = point.add(Vector3.yAxis.mul(5));
		const direction = Vector3.yAxis.mul(-10);
		const raycast = Workspace.Raycast(origin, direction, params);
		if (raycast === undefined) {
			return;
		}
		const effect = prefab.Clone();

		setCollision(effect, Collision.Debris, true);
		const normal = raycast.Normal;
		const position = raycast.Position;
		const look = position.add(normal).Unit;
		const cframe = CFrame.fromMatrix(position, look.Cross(normal), normal.mul(-1));
		effect.CFrame = cframe;
		effect.Name = `(${model.Name})-${TowerVisual.Neutron}`;
		effect.Parent = debris;

		const thread = task.delay(2.5, (): void => {
			const emitters = effect.GetDescendants();
			for (const emitter of emitters) {
				if (!emitter.IsA("ParticleEmitter")) {
					continue;
				}
				emitter.Enabled = false;
			}
		});

		bin.add(thread);
		bin.add(effect);
	},
};
