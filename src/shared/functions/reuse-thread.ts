// https://github.com/rbxts-flamework/core/blob/dc9f878f3d209188e6734388032870a53e9a772f/src/flamework.ts#L138
// https://github.com/rbxts-flamework/core/blob/dc9f878f3d209188e6734388032870a53e9a772f/src/flamework.ts#L172C1-L172C1

// Only slightly modified to fit my style.
let inactiveThread: thread | undefined = undefined;

function reusableThread(callback: Callback): void {
	const thread = coroutine.running();
	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (inactiveThread === thread) {
			inactiveThread = undefined;
		}
		callback();
		if (inactiveThread !== undefined) {
			break;
		}
		inactiveThread = thread;
		[callback] = coroutine.yield() as LuaTuple<[never]>;
	}
}

export function reuseThread(callback: () => void): void {
	if (inactiveThread !== undefined) {
		task.spawn(inactiveThread, callback);
	} else {
		task.spawn(reusableThread, callback);
	}
}
