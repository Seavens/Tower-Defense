import { Players } from "@rbxts/services";
import { useCallback, useEffect, useState } from "@rbxts/roact-hooked";

const Player = Players.LocalPlayer;

export function useCharacter(listener?: (character: Model) => void): Model | undefined {
	const [value, setValue] = useState<Model>();

	const onAdded = useCallback(
		(character: Model): void => {
			if (character === undefined) {
				return;
			}
			setValue(character);
			listener !== undefined && listener(character);
		},
		[listener],
	);

	useEffect((): (() => void) => {
		const connection = Player.CharacterAdded.Connect(onAdded);
		const character = Player.Character;
		character !== undefined && onAdded(character);
		return function (): void {
			connection.Disconnect();
		};
	}, [onAdded]);

	return value;
}
