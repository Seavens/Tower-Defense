import type { Collision } from "./types";

export function setCollision(instance: Instance, group: Collision, descendants = false): void {
	const instances = descendants ? instance.GetDescendants() : instance.GetChildren();
	instances.push(instance);
	for (const instance of instances) {
		if (!instance.IsA("BasePart")) {
			continue;
		}
		instance.CollisionGroup = group;
	}
}
