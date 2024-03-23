type RBXAssetId = `rbxassetid://${number}`;

type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

type Option<T> = T | undefined;
