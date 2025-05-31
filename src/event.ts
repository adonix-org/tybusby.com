type EventsMap = Record<string, any>;

type EventArg<K, T> = T extends void ? [event: K] : [event: K, data: T];

export class EventEmitter<TEvents extends EventsMap> {
    private listeners: {
        [K in keyof TEvents]?: Array<(data: TEvents[K]) => void>;
    } = {};

    public on<K extends keyof TEvents>(
        event: K,
        listener: (data: TEvents[K]) => void
    ): this {
        (this.listeners[event] ||= []).push(listener);
        return this;
    }

    public off<K extends keyof TEvents>(
        event: K,
        listener: (data: TEvents[K]) => void
    ): this {
        this.listeners[event] = this.listeners[event]?.filter(
            (l) => l !== listener
        );
        return this;
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
