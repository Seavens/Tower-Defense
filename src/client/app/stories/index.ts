import { withHookDetection } from "@rbxts/roact-hooked";
import Roact from "@rbxts/roact";
import type { Element } from "@rbxts/roact";

export interface FlipbookStory<T = undefined> {
	roact?: typeof Roact;
	summary: string;
	controls: Partial<T>;
	story: (props: { controls: T }) => Element;
}

export function CreateStory<T = undefined>(story: Omit<FlipbookStory<T>, "roact">): FlipbookStory<T> {
	withHookDetection(Roact);
	return {
		roact: Roact,
		...story,
	};
}
