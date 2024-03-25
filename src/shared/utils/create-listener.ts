import { Modding } from "@flamework/core";
import { reuseThread } from "./reuse-thread";

type ListenerReturn<T> = Promise<ReturnType<T[keyof T]> | void>;
type ListenerParameters<T> = Parameters<T[keyof T]>;

interface ListenerMetatable<T> {
	__call: (...args: ListenerParameters<T>) => Array<ListenerReturn<T>>;
}

interface Listener<T> {
	fire: (...args: ListenerParameters<T>) => Array<ListenerReturn<T>>;
	resolving: () => Array<ListenerReturn<T>>;
}

/**
 * @metadata macro
 */
export function createListener<T>(index?: Modding.Many<keyof T>, id?: Modding.Generic<T, "id">): Listener<T> {
	const connected = new Set<T>();
	const resolving = new Array<ListenerReturn<T>>();

	Modding.onListenerAdded<T>((object: T): Set<T> => connected.add(object), id);
	Modding.onListenerRemoved<T>((object: T): boolean => connected.delete(object), id);

	const listener: Listener<T> = {
		fire: (...args: ListenerParameters<T>): Array<ListenerReturn<T>> => {
			const promises = table.clone(resolving);
			for (const promise of promises) {
				const status = promise.getStatus();
				if (status === Promise.Status.Started) {
					continue;
				}
				const index = resolving.indexOf(promise);
				resolving.remove(index);
			}
			promises.clear();
			for (const listener of connected) {
				reuseThread((): void => {
					const fn = listener[index!];
					if (!typeIs(fn, "function")) {
						return;
					}
					const promise = Promise.try((): Awaited<ListenerReturn<T>> => fn(listener, ...args)).finally(
						(): void => {
							const index = resolving.indexOf(promise);
							resolving.remove(index);
						},
					);
					resolving.push(promise);
				});
			}
			return resolving;
		},
		resolving: (): Array<ListenerReturn<T>> => {
			return resolving;
		},
	};
	const metatable: ListenerMetatable<T> = {
		__call: (...args: ListenerParameters<T>): Array<ListenerReturn<T>> => {
			return listener.fire(...args);
		},
	};
	setmetatable(listener, metatable as never);
	return listener;
}
