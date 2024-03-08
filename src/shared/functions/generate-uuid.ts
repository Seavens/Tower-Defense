import { HttpService } from "@rbxts/services";

export function generateUUID(): string {
    const generated = HttpService.GenerateGUID(false);
    const [uuid] = generated.gsub("-", "");
    return uuid;
}