import { Collision } from "shared/utility/collision";
import { TweenService, Workspace } from "@rbxts/services";
import Shake from "@rbxts/rbx-sleitnick-shake";
import type { Bin } from "@rbxts/bin";

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

	export function connectShake(
		shake: Shake,
		priority: number,
		callback: (delta: number, position: Vector3, rotation: Vector3) => void,
	): void {
		let last = 0;
		shake.BindToRenderStep(Shake.NextRenderName(), priority, (position: Vector3, rotation: Vector3): void => {
			const delta = time() - last;
			callback(delta, position, rotation);
			last = time();
		});
	}
}
