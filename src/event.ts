/*
 * Copyright (C) 2025 Ty Busby
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

type EventsMap = Record<string, any>;
type EventArg<K, T> = T extends void ? [event: K] : [event: K, data: T];
type Listener<T> = T extends void ? () => void : (data: T) => void;

export class EventEmitter<TEvents extends EventsMap> {
    private listeners: {
        [K in keyof TEvents]?: Array<Listener<TEvents[K]>>;
    } = {};

    public on<K extends keyof TEvents>(
        event: K,
        listener: Listener<TEvents[K]>
    ): this {
        (this.listeners[event] ||= []).push(listener);
        return this;
    }

    public off<K extends keyof TEvents>(
        event: K,
        listener: Listener<TEvents[K]>
    ): this {
        this.listeners[event] = this.listeners[event]?.filter(
            (l) => l !== listener
        );
        return this;
    }

    public once<K extends keyof TEvents>(
        event: K,
        listener: Listener<TEvents[K]>
    ): this {
        const wrapper: Listener<TEvents[K]> = ((...args: any[]) => {
            this.off(event, wrapper);
            (listener as any)(...args);
        }) as Listener<TEvents[K]>;

        return this.on(event, wrapper);
    }

    protected emit<K extends keyof TEvents>(
        ...args: EventArg<K, TEvents[K]>
    ): void {
        const [event, data] = args as [K, TEvents[K]];
        this.listeners[event]?.forEach((listener) => {
            (listener as (data: TEvents[K]) => void)(data);
        });
    }
}
