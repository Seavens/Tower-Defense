import { inventorySlice } from "./inventory-slice";
import { placementSlice } from "./placement-slice";
import { profileSlice } from "./player-slice";
import type { InventoryState } from "./inventory-slice";
import type { PlacementState } from "./placement-slice";
import type { ProfileActions } from "shared/state/actions";

export { inventorySlice, profileSlice, placementSlice };
export type { InventoryState, ProfileActions, PlacementState };
