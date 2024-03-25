import { HttpService } from "@rbxts/services";

export function createUUID(): UUID {
	const generated = HttpService.GenerateGUID(false);
	const [uuid] = generated.gsub("-", "");
	return uuid as UUID;
}
