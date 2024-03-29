// Resourced from Littensy: https://github.com/littensy/slither
import { UserInputService } from "@rbxts/services";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";

export type InputDevice = "keyboard" | "gamepad" | "touch";

const getInputType = (inputType = UserInputService.GetLastInputType()): InputDevice | undefined => {
	if (inputType === Enum.UserInputType.Keyboard || inputType === Enum.UserInputType.MouseMovement) {
		return "keyboard";
	} else if (inputType === Enum.UserInputType.Gamepad1) {
		return "gamepad";
	} else if (inputType === Enum.UserInputType.Touch) {
		return "touch";
	}
	return "keyboard";
};

/**
 * Returns the current input device being used by the player.
 * @returns An InputDevice string.
 */
export function useInputDevice(): InputDevice {
	const [device, setDevice] = useState<InputDevice>(() => {
		return getInputType() ?? "keyboard";
	});

	useEventListener(UserInputService.LastInputTypeChanged, (inputType) => {
		const newDevice = getInputType(inputType);

		if (newDevice !== undefined) {
			setDevice(newDevice);
		}
	});

	return device;
}
