import { Bin } from "@rbxts/bin";
import { Collision } from "shared/utility/collision";
import { SettingId } from "shared/players/settings";
import { TweenService, Workspace } from "@rbxts/services";
import { selectSettingValues } from "client/players/profile/settings";
import { store } from "client/state/store";
import Shake from "@rbxts/rbx-sleitnick-shake";

const { debris, characters, placed, mobs } = Workspace;

export const params = new RaycastParams();
params.AddToFilter([debris, characters, placed, mobs]);
params.FilterType = Enum.RaycastFilterType.Exclude;

const settings = UserSettings().GetService("UserGameSettings");
const info = new TweenInfo(1);

export namespace VisualUtility {
	export function emitParticle(particle: ParticleEmitter, fallback: number): void {
		let count = particle.GetAttribute("EmitCount");
		count = typeIs(count, "number") ? count : fallback;
		const level = settings.SavedQualityLevel;
		const alpha = level.Value / 10;
		count *= alpha;
		particle.Emit(count);
	}

	export function emitRocks(bin: Bin, point: Vector3, count: number, scatter = 1, power = 1): void {
		const origin = point.add(Vector3.yAxis.mul(5));
		const direction = Vector3.yAxis.mul(-10);
		const raycast = Workspace.Raycast(origin, direction, params);
		if (raycast === undefined) {
			return;
		}
		const instance = raycast.Instance;
		for (const _ of $range(1, count)) {
			const x = math.random(-scatter, scatter);
			const z = math.random(-scatter, scatter);
			const size = Vector3.one.mul(0.5 * math.random());
			const rock = new Instance("Part");
			rock.Anchored = false;
			rock.Massless = true;
			rock.CanCollide = true;
			rock.CollisionGroup = Collision.Debris;
			rock.Position = point.add(new Vector3(0, size.Y / 2, 0));
			rock.Color = instance.Color;
			rock.Material = instance.Material;
			rock.Transparency = instance.Transparency;
			rock.Size = size;
			rock.Parent = debris;
			rock.ApplyImpulse(new Vector3(x, power, z));
			const tween = TweenService.Create(rock, info, { Transparency: 1 });
			const thread = task.delay(2, (): void => {
				tween.Play();
			});
			bin.add(rock);
			bin.add(thread);
			bin.add(tween);
		}
	}

	export function onShake(
		priority: number,
		camera?: Camera,
		fadeInTime: number = 0,
		fadeOutTime: number = 0.25,
		frequency: number = 0.1,
		amplitude: number = 0.01,
		sustainTime: number = 3,
	): void {
		const values = store.getState(selectSettingValues);
		const visual = values.get(SettingId.ToggleVfx);
		if (!typeIs(visual, "boolean") || !visual) {
			return;
		}

		const bin = new Bin();
		const shake = new Shake();
		shake.FadeInTime = fadeInTime;
		shake.FadeOutTime = fadeOutTime;
		shake.Frequency = frequency;
		shake.Amplitude = amplitude;
		shake.SustainTime = sustainTime;
		bin.add(shake);

		let last = 0;
		shake.Start();
		shake.BindToRenderStep(Shake.NextRenderName(), priority, (position: Vector3, rotation: Vector3): void => {
			const delta = time() - last;
			if (camera === undefined) {
				return;
			}
			const current = camera.CFrame;
			camera.CFrame = current.Lerp(
				current.mul(new CFrame(position).mul(CFrame.Angles(rotation.X, rotation.Y, rotation.Z))),
				math.clamp(delta * 60, 0, 1),
			);
			last = time();
		});
		task.delay(sustainTime + fadeInTime + fadeOutTime, (): void => {
			bin.destroy();
		});
	}
}
