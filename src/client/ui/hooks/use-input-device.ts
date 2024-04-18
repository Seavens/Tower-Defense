import { UserInputService } from "@rbxts/services";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";

export type InputDevice = "keyboard" | "gamepad" | "touch";

function getInputType(inputType = UserInputService.GetLastInputType()): InputDevice {
	if (inputType === Enum.UserInputType.Keyboard || inputType === Enum.UserInputType.MouseMovement) {
		return "keyboard";
	} else if (inputType === Enum.UserInputType.Gamepad1) {
		return "gamepad";
	} else if (inputType === Enum.UserInputType.Touch) {
		return "touch";
	}
	return "keyboard";
}

export function useInputDevice(): InputDevice {
	const [device, setDevice] = useState<InputDevice>(() => {
		return getInputType();
	});

	useEventListener(UserInputService.LastInputTypeChanged, (inputType: Enum.UserInputType) => {
		const newDevice = getInputType(inputType);
		if (newDevice === undefined) {
			return;
		}
		setDevice(newDevice);
	});

	return device;
}
