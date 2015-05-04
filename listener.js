var ONCE = 1;
var SUSPENDED = 2;

export default class Listener {
  constructor(key, method, target, flags = 0) {
    this.key = key;
    this.method = method;
    this.flags = flags;
    this.target = target;

    this._informed = 0;
  }

  is(key) {
    return this.key === key;
  }

  isSuspended() {
    return this.flags & SUSPENDED;
  }

  isOnce() {
    return this.flags & ONCE;
  }

  suspend() {
    this.flags |= SUSPENDED;
  }

  resume() {
    this.flags &= ~SUSPENDED;
  }

  inform(obj, eventName, params) {
    var target = this.target || obj;
    this._informed++;

    if (this.method === 'string') {
      target[this.method].apply(target, params);
    } else {
      target.method.apply(target, params);
    }
  }
}
