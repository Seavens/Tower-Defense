import { PALETTE } from "../../constants";
import { RunService } from "@rbxts/services";
import { createPortal } from "@rbxts/react-roblox";
import { getBindingValue, useEventListener, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import React, { useMemo, useState } from "@rbxts/react";
import type { BindingOrValue } from "@rbxts/pretty-react-hooks";
import type { Element, InstanceChangeEvent, InstanceEvent, PropsWithChildren, ReactNode } from "@rbxts/react";

interface TransitionProps extends PropsWithChildren {
	groupColor?: BindingOrValue<Color3>;
	groupTransparency?: BindingOrValue<number>;
	anchorPoint?: BindingOrValue<Vector2>;
	size?: BindingOrValue<UDim2>;
	position?: BindingOrValue<UDim2>;
	rotation?: BindingOrValue<number>;
	clipsDescendants?: BindingOrValue<boolean>;
	layoutOrder?: BindingOrValue<number>;
	zIndex?: BindingOrValue<number>;
	event?: InstanceEvent<Frame | CanvasGroup>;
	change?: InstanceChangeEvent<Frame | CanvasGroup>;
	directChildren?: ReactNode;
	children?: ReactNode;
}

const EPSILON = 0.03;

export function Transition({
	groupColor,
	groupTransparency,
	anchorPoint,
	size = new UDim2(1, 0, 1, 0),
	position,
	rotation,
	clipsDescendants,
	layoutOrder,
	zIndex,
	event,
	change,
	children,
	directChildren,
}: TransitionProps): Element {
	const [frame, setFrame] = useState<Frame>();
	const [canvas, setCanvas] = useState<CanvasGroup>();

	const container = useMemo(() => {
		const container = new Instance("Frame");
		container.Size = new UDim2(1, 0, 1, 0);
		container.BackgroundTransparency = 1;
		return container;
	}, []);

	useEventListener(RunService.Heartbeat, () => {
		const transparency = getBindingValue(groupTransparency) ?? 0;
		const color = getBindingValue(groupColor) || PALETTE.black;

		pcall(() => {
			if (transparency > EPSILON || color !== PALETTE.black) {
				container.Parent = canvas;
			} else {
				container.Parent = frame;
			}
		});
	});

	useUnmountEffect(() => {
		container.Destroy();
	});

	return (
		<frame
			BackgroundTransparency={1}
			AnchorPoint={anchorPoint}
			Size={size}
			Position={position}
			Rotation={rotation}
			LayoutOrder={layoutOrder}
			ZIndex={zIndex}
		>
			{createPortal(<>{children}</>, container)}
			<canvasgroup
				ref={setCanvas}
				Change={change}
				Event={event}
				GroupTransparency={groupTransparency}
				GroupColor3={groupColor}
				BackgroundTransparency={1}
				Size={new UDim2(1, 0, 1, 0)}
			>
				{directChildren}
			</canvasgroup>
			<frame
				ref={setFrame}
				Change={change}
				Event={event}
				ClipsDescendants={clipsDescendants}
				BackgroundTransparency={1}
				Size={new UDim2(1, 0, 1, 0)}
			>
				{directChildren}
			</frame>
		</frame>
	);
}
