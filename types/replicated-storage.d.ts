interface ReplicatedStorage {
	characters: Folder & {
		base: Model;
	};
	assets: Folder & {
		mobs: Folder;
		items: Folder;
		effects: Folder;
	};
}
