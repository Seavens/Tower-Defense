interface ReplicatedStorage {
	characters: Folder & {
		base: Model;
	};
	assets: Folder & {
		mobs: Folder;
		towers: Folder;
	};
}
