import { FONTS } from "client/ui/constants";
import { Group, Text } from "client/ui/components";
import { Latte } from "@rbxts/catppuccin";
import { usePx } from "client/ui/hooks";
import React, { useMemo } from "@rbxts/react";
import type { Element } from "@rbxts/react";
import type { ReplicatedTower } from "shared/tower/types";

interface TowerStatProps {
	tower: ReplicatedTower;
	stat: "Upgrade" | "Damage" | "Range" | "Cooldown";
	layoutOrder: number;
	formatter: (tower: ReplicatedTower) => string;
}

export function TowerStat({ tower, stat, layoutOrder, formatter }: TowerStatProps): Element {
	const px = usePx();

	const text = useMemo((): string => {
		return formatter(tower);
	}, [tower, formatter]);

	return (
		<Group size={UDim2.fromScale(1, 0.25)} key={"stat-group"} layoutOrder={layoutOrder}>
			<Text
				size={UDim2.fromScale(1, 1)}
				position={UDim2.fromScale(0, 0)}
				anchorPoint={Vector2.zero}
				backgroundTransparency={1}
				text={`${stat}:`}
				textXAlignment={"Left"}
				textColor={Latte.Base}
				textSize={px(18)}
				font={FONTS.nunito.regular}
				richText={true}
				layoutOrder={2}
				key={"stat-name"}
			/>
			<Text
				size={UDim2.fromScale(1, 1)}
				position={UDim2.fromScale(0, 0)}
				anchorPoint={Vector2.zero}
				backgroundTransparency={1}
				text={text}
				textXAlignment={"Right"}
				textColor={Latte.Base}
				textSize={px(18)}
				font={FONTS.nunito.regular}
				richText={true}
				layoutOrder={2}
				key={"stat-value"}
			/>
			<uipadding PaddingLeft={new UDim(0, px(3))} PaddingRight={new UDim(0, px(3))} key={"stat-padding"} />
		</Group>
	);
}
