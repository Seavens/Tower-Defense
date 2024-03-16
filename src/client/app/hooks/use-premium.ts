// Resourced from Littensy: https://github.com/littensy/slither
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Players } from "@rbxts/services";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/react";

export function usePremium() {
	const [isPremium, setIsPremium] = useState(Players.LocalPlayer.MembershipType === Enum.MembershipType.Premium);

	useEventListener(Players.PlayerMembershipChanged, (player) => {
		if (player === Players.LocalPlayer) {
			setIsPremium(player.MembershipType === Enum.MembershipType.Premium);
		}
	});

	return isPremium;
}
