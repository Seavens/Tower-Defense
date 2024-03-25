import { Flamework } from "@flamework/core";

export const enum ComponentTag {
	// Locations
	SpawnLocation = "component_tag:spawn_location",
	Placeable = "component_tag:placeable",

	// Entities
	Character = "component_tag:character",
	Mob = "component_tag:mob",
	Tower = "component_tag:tower",
}

export const isComponentTag = Flamework.createGuard<ComponentTag>();
