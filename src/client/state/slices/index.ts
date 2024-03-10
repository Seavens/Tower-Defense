import { inventorySlice } from "./inventory-slice";
import { profileSlice } from "./player-slice";
import type { InventoryState } from "./inventory-slice";
import type { ProfileActions } from "shared/state/actions";

export { inventorySlice, profileSlice };
export type { InventoryState, ProfileActions };
