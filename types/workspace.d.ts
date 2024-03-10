interface Workspace {
	characters: Folder;
	map: Folder & {
		waypoints: Folder;
		spawnLocation: SpawnLocation;
	};
	mobs: Folder;
}
