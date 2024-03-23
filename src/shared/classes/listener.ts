import { Bin } from "@rbxts/bin";
import { Modding } from "@flamework/core";
import { reuseThread } from "shared/functions/reuse-thread";

/**
 * @metadata macro
 */
export class Listener<T extends defined> {
	public readonly index: keyof T;
	public readonly id: Modding.Generic<T, "id">;
	public readonly async: boolean;

	private readonly connected = new Set<T>();
	private readonly resolving = new Array<Promise<ReturnType<T[keyof T]>>>();
	private readonly bin = new Bin();

	public constructor(async?: boolean, index?: Modding.Many<keyof T>, id?: Modding.Generic<T, "id">) {
		this.async = async ?? true;
		this.index = index!;
		this.id = id!;
		this.init();
	}

	public getResolving(): Array<Promise<ReturnType<T[keyof T]>>> {
		const { resolving } = this;
		return resolving;
	}

	// Insane return type. :sob:
	public fire(...args: Parameters<T[keyof T]>): Array<Promise<ReturnType<T[keyof T]>>> {
		const { index, connected, resolving } = this;
		const promises = new Array<Promise<ReturnType<T[keyof T]>>>();
		for (const promise of resolving) {
			promises.push(promise);
		}
		resolving.clear();
		for (const listener of connected) {
			reuseThread((): void => {
				const fn = listener[index];
				if (!typeIs(fn, "function")) {
					return;
				}
				const promise = Promise.try((): ReturnType<T[keyof T]> => fn(listener, ...args));
				promises.push(promise);
			});
		}
		return promises;
	}

	public destroy(): void {
		const { bin } = this;
		bin.destroy();
	}

	protected init(): void {
		const { id, connected, resolving, bin } = this;
		bin.add(
			Modding.onListenerAdded<T>((listener: T): void => {
				connected.add(listener);
			}, id),
		);
		bin.add(
			Modding.onListenerRemoved<T>((listener: T): void => {
				connected.delete(listener);
			}, id),
		);
		bin.add((): void => {
			connected.clear();
			resolving.clear();
		});
	}
}
