import { RunService } from "@rbxts/services";

interface SchedulerOptions {
	name: string;
	tick: number;
	phase?: number;
	onTick?: (deltaTime: number) => void;
	onRender?: (deltaTime: number, alpha: number) => void;
}

const connected = new Set<RBXScriptConnection>();

export function createSchedule({ name, phase, tick, onRender, onTick }: SchedulerOptions): () => void {
	let timer = phase ?? 0;
	const connection = RunService.Heartbeat.Connect((delta: number) => {
		const time = math.min(delta, tick);
		timer += time;
		while (timer >= tick) {
			timer -= tick;
			debug.profilebegin(name);
			onTick?.(tick);
			debug.profileend();
		}

		onRender?.(time, timer / tick);
	});
	connected.add(connection);
	return (): void => {
		connection.Disconnect();
		connected.delete(connection);
	};
}
