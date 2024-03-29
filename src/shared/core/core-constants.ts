import { RunService } from "@rbxts/services";

export const IS_STUDIO = RunService.IsStudio();
export const IS_EDIT = IS_STUDIO && !RunService.IsRunning();

export const USE_MOCK_DATA = IS_STUDIO;
export const WIPE_MOCK_DATA = true;

export const GAME_TIMESTEP = 1;
export const MOB_POSITION_UPDATE = 1 / 4;
export const INTERPOLATION_SMOOTHNESS = 0.5;
