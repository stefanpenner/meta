export default class Meta {
  constructor(parent, obj) {
    this.listeners = [];
    this.parent = parent;
    this.obj = obj;
  }

  addListener(listener) {
    if (this.finalized) {
      throw new Error('Meta finalized');
    }

    this.listeners.push(listener);
  }

  removeListener(key) {
    if (this.finalized) {
      throw new Error('Meta finalized');
    }

    removeListener(this.listeners, key);
  }

  notify(obj, key, value) {
    if (this.finalized) {
      notify(this.finalizedListeners[key], obj, key, value);
    } else {
      notify(this.listeners, obj, key, value);
      if (this.parent) {
        this.parent.notify(obj, key, value);
      }
    }
  }

  finalize() {
    if (this.finalized) { return; }
    if (this.parent)    { this.parent.finalize(); }

    this.finalizedListeners = finalizeListeners(this);

    this.finalized = true;
  }
}

function finalizeListeners(meta) {
  let listeners = meta.listeners;

  if (meta.parent) {
    listeners = listeners.concat(finalizeListeners(meta.parent));
  }

  meta.listeners = undefined;
  let finalized = Object.create(null);

  for (let i = 0; i < listeners.length; i++) {
    let listener = listeners[i];
    let bucket = meta.finalized[listener.key] || [];

    bucket.push(listener);
  }

  return toFastObject(finalized);
}

function removeListener(listeners, key) {
  for (var i = 0; i < listeners.length; i) {
    var listener = listeners[i];

    if (listener.is(key)) {
      listeners.splice(i, 1);
      return;
    }
  }
}

function notify(listeners, obj, key, value) {
  for (let i = 0; i < listeners.length; i++) {
    let listener = listeners[i];

    if (listener.is(key) && !listener.isSuspended()) {

      if (listener.isOnce()) {
        listeners.splice(i, 1);
      }

      listener.inform(obj, value);
    }
  }
}

function toFastObject(obj) {
  // source: https://github.com/petkaantonov/bluebird/blob/7caba852c072f2ea3622b40c0b7a6eeb3fae97d3/src/util.js#L177
  /*jshint -W027,-W055,-W031*/
  function f() {}
  f.prototype = obj;
  var l = 8;
  while (l--) { new f(); }
  return obj;
  eval(obj);
}
