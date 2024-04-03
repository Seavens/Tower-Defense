import { type BindingOrValue, useComposedRef, useDeferState } from "@rbxts/pretty-react-hooks";
import { Group } from "../basic";
import React, {
	type Element,
	type InstanceChangeEvent,
	type InstanceEvent,
	type PropsWithChildren,
	useEffect,
	useState,
} from "@rbxts/react";

interface RenderInViewProps extends PropsWithChildren {
	ref?: (rbx?: Frame) => void;
	change?: InstanceChangeEvent<Frame>;
	event?: InstanceEvent<Frame>;
	container?: GuiObject;
	containerMargin?: Vector2;
	size?: BindingOrValue<UDim2>;
	position?: BindingOrValue<UDim2>;
	anchorPoint?: BindingOrValue<Vector2>;
	zIndex?: BindingOrValue<number>;
	layoutOrder?: BindingOrValue<number>;
}

/**
 * Unmount the children if this invisible container frame is
 * outside of the `container` object's bounds plus the margin
 */
export function RenderInView({
	ref,
	change = {},
	event = {},
	container,
	containerMargin = Vector2.zero,
	size,
	position,
	anchorPoint,
	zIndex,
	layoutOrder,
	children,
}: RenderInViewProps): Element {
	const [frame, setFrame] = useState<Frame>();
	const [shouldRender, setShouldRender] = useDeferState(false);

	useEffect(() => {
		if (!frame || !container) return undefined;

		// Set shouldRender to 'true' if any part of the frame is inside the container
		const updateShouldRender = (): void => {
			const framePosition = frame.AbsolutePosition;
			const frameSize = frame.AbsoluteSize;

			const containerPosition = container.AbsolutePosition.sub(containerMargin.div(2));
			const containerSize = container.AbsoluteSize.add(containerMargin);

			const inFrame =
				framePosition.X + frameSize.X > containerPosition.X &&
				framePosition.X < containerPosition.X + containerSize.X &&
				framePosition.Y + frameSize.Y > containerPosition.Y &&
				framePosition.Y < containerPosition.Y + containerSize.Y;

			setShouldRender(inFrame);
		};

		const connections = [
			frame.GetPropertyChangedSignal("AbsolutePosition").Connect(updateShouldRender),
			frame.GetPropertyChangedSignal("AbsoluteSize").Connect(updateShouldRender),

			container.GetPropertyChangedSignal("AbsolutePosition").Connect(updateShouldRender),
			container.GetPropertyChangedSignal("AbsoluteSize").Connect(updateShouldRender),
		];

		updateShouldRender();

		return (): void => {
			for (const connection of connections) {
				connection.Disconnect();
			}
		};
	}, [frame, container, containerMargin]);

	return (
		<Group
			ref={useComposedRef(setFrame, ref)}
			change={change}
			event={event}
			size={size}
			position={position}
			anchorPoint={anchorPoint}
			zIndex={zIndex}
			layoutOrder={layoutOrder}
		>
			{shouldRender && children}
		</Group>
	);
}
