interface Workspace {
	characters: Folder;
	map: Folder & {
		waypoints: Folder;
	};
	mobs: Folder;
}