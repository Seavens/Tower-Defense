import { RunService } from "@rbxts/services";

export const IS_STUDIO = RunService.IsStudio();
export const IS_EDIT = IS_STUDIO && !RunService.IsRunning();

export const USE_MOCK_DATA = IS_STUDIO;
export const WIPE_MOCK_DATA = true;

export const GAME_TIMESTEP = 0.5;
export const GAME_TICK_RATE = 1 / 45;
export const INTERPOLATION_SMOOTHNESS = 0.8;

export const IS_LOBBY = false;
