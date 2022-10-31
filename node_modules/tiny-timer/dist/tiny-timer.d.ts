import { EventType, Handler } from 'mitt';
declare type Status = 'running' | 'paused' | 'stopped';
declare class Timer {
    private _interval;
    private _stopwatch;
    private _duration;
    private _endTime;
    private _pauseTime;
    private _status;
    private _timeoutID?;
    private _emitter;
    constructor({ interval, stopwatch }?: {
        interval?: number | undefined;
        stopwatch?: boolean | undefined;
    });
    start(duration: number, interval?: number): void;
    stop(): void;
    pause(): void;
    resume(): void;
    private _changeStatus;
    private tick;
    get time(): number;
    get duration(): number;
    get status(): Status;
    on(eventName: EventType, handler: Handler<any>): void;
    off(eventName: EventType, handler: Handler<any>): void;
}
export default Timer;
