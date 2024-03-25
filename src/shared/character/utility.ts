import { CollectionService, ReplicatedStorage } from "@rbxts/services";
import { Collision, setCollision } from "shared/utils/collision";
import { ComponentTag } from "shared/components/types";

const { characters } = ReplicatedStorage;
if (characters.FindFirstChild("base") === undefined) {
	throw `A base character was not provided within ${characters.GetFullName()}`;
}
const { base } = characters;
const humanoid = base.FindFirstChildOfClass("Humanoid");
const animator = base.FindFirstChildWhichIsA("Animator", true);
const animate = base.FindFirstChild("Animate");
// if (humanoid !== undefined && humanoid.RigType !== Enum.HumanoidRigType.R6) {
// 	warn(
// 		`Character class expects ${base.GetFullName()} to be an R6 rig! If you wish to use an R15 rig, update "shared/constants/character-constants.ts", "CHARACTER_BASE_ANIMATIONS" to use R15 animations!`,
// 	);
// }
if (humanoid === undefined) {
	warn(
		`Character class is capable of working without a humanoid however ${base.GetFullName()} is expected to have a humanoid!`,
	);
}
if (animate !== undefined) {
	warn(`Character class handles animations, ${animate.GetFullName()} is unnecessary and may cause issues!`);
}
if (animator === undefined) {
	warn(
		`Character class and Animator class require an "Animator" to be parented under ${base.GetFullName()} to run animations!`,
	);
}

export function getCharacterRig(user?: string): Model {
	if (user === undefined) {
		setCollision(base, Collision.Character, true);
		return base;
	}
	const rig = characters.FindFirstChild(user);
	if (rig === undefined || !rig.IsA("Model")) {
		setCollision(base, Collision.Character, true);
		return base;
	}
	setCollision(rig, Collision.Character, true);
	return rig;
}

export function getSpawnLocation(): CFrame {
	const spawns = CollectionService.GetTagged(ComponentTag.SpawnLocation);
	const max = spawns.size();
	if (max <= 0) {
		warn(`Expected >=1 spawn location(s), got 0! Defaulting to "CFrame.identity" as the spawn location!`);
		return CFrame.identity;
	}
	const index = math.random(1, spawns.size());
	const instance = spawns[index - 1];
	if (instance === undefined || !instance.IsA("BasePart")) {
		warn(
			`${instance.GetFullName()} is not a BasePart! Instances tagged with ${
				ComponentTag.SpawnLocation
			} are expected to be of class BasePart! Defaulting to "CFrame.identity" as the spawn location!`,
		);
		return CFrame.identity;
	}
	const size = instance.Size;
	const random = new Vector3(
		math.random(-size.X / 2, size.X / 2),
		math.random(-size.Y / 2, size.Y / 2),
		math.random(-size.Z / 2, size.Z / 2),
	).mul(math.random());
	const cframe = instance.GetPivot();
	return cframe.add(random);
}
