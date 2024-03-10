import { ItemSlot } from "client/app/components/index";
import { TowerId } from "shared/types/ids";
import Roact from "@rbxts/roact";
import type { Element } from "@rbxts/roact";

const tower = {
	level: 10,
	id: TowerId.God,
	owner: 1,
	original: 1,
	damage: 1,
	range: 1,
	attackSpeed: 1,
	uuid: "1",
	timestamp: 1,
};

export default function App(): Element {
	return (
		<screengui IgnoreGuiInset={true}>
			<ItemSlot towerData={tower} />
		</screengui>
	);
}
