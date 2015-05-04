import Meta from './meta';
import Listener from './listener';

export function metaFor(obj) {
  if (obj._meta) { return obj._meta; }
  return (obj._meta = new Meta(undefined));
}

export function addListener(obj, key, fn) {
  metaFor(obj).addListener(new Listener(key, fn));
}

export function removeListener(obj, key, fn) {
  metaFor(obj).removeListener(key, fn);
}
