interface Workspace {
	characters: Folder;

	map: Folder & {
		waypoints: Folder;
		spawnLocation: SpawnLocation;
		placeable: Folder;
	};
	mobs: Folder;
	placed: Folder;
	debris: Folder;
}
