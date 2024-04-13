interface Workspace {
	characters: Folder;

	map: Folder & {
		waypoints: Folder;
		spawn: SpawnLocation;
		placeable: Folder;
	};
	mobs: Folder;
	placed: Folder;
	debris: Folder;
}
