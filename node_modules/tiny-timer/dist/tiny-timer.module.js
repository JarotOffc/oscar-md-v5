import mitt from 'mitt';

class Timer {
  constructor({
    interval = 1000,
    stopwatch = false
  } = {}) {
    this._duration = 0;
    this._endTime = 0;
    this._pauseTime = 0;
    this._status = 'stopped';
    this._emitter = mitt();

    this.tick = () => {
      if (this.status === 'paused') return;

      if (Date.now() >= this._endTime) {
        this.stop();

        this._emitter.emit('tick', this._stopwatch ? this._duration : 0);

        this._emitter.emit('done');
      } else {
        this._emitter.emit('tick', this.time);
      }
    };

    this._interval = interval;
    this._stopwatch = stopwatch;
  }

  start(duration, interval) {
    if (this.status !== 'stopped') return;

    if (duration == null) {
      throw new TypeError('Must provide duration parameter');
    }

    this._duration = duration;
    this._endTime = Date.now() + duration;

    this._changeStatus('running');

    this._emitter.emit('tick', this._stopwatch ? 0 : this._duration);

    this._timeoutID = setInterval(this.tick, interval || this._interval);
  }

  stop() {
    if (this._timeoutID) clearInterval(this._timeoutID);

    this._changeStatus('stopped');
  }

  pause() {
    if (this.status !== 'running') return;
    this._pauseTime = Date.now();

    this._changeStatus('paused');
  }

  resume() {
    if (this.status !== 'paused') return;
    this._endTime += Date.now() - this._pauseTime;
    this._pauseTime = 0;

    this._changeStatus('running');
  }

  _changeStatus(status) {
    this._status = status;

    this._emitter.emit('statusChanged', this.status);
  }

  get time() {
    if (this.status === 'stopped') return 0;
    const time = this.status === 'paused' ? this._pauseTime : Date.now();
    const left = this._endTime - time;
    return this._stopwatch ? this._duration - left : left;
  }

  get duration() {
    return this._duration;
  }

  get status() {
    return this._status;
  }

  on(eventName, handler) {
    this._emitter.on(eventName, handler);
  }

  off(eventName, handler) {
    this._emitter.off(eventName, handler);
  }

}

export default Timer;
//# sourceMappingURL=tiny-timer.module.js.map
