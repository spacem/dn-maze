function storageAvailable() {
  try {
    const storage = window.localStorage;
    const x = '__storage_test__';

    storage.setItem(x, x);
    storage.removeItem(x);

    return true;
  } catch (ex) {
    return false;
  }
}

function getPrefix() {
  const appVersion = process.env.VERSION;
  const buildVersion = process.env.BUILD_VERSION;

  // "The following snippet accesses the current domain's local Storage...."
  // this mean that no prefix is necessary, just app version + build version prefix.
  return `${appVersion}_${buildVersion}`;
}

export function put(key, value) {
  if (process.env.NODE_ENV !== 'production' || !storageAvailable()) {
    return;
  }

  // if (!storageAvailable()) {
  //   return;
  // }

  const prefix = getPrefix();
  const keyName = `${prefix}_${key}`;
  const now = new Date().getTime();
  const timeName = `${prefix}_${key}_time`;

  window.localStorage.setItem(keyName, JSON.stringify(value));
  window.localStorage.setItem(timeName, `${now}`);
}

export function get(key) {
  if (process.env.NODE_ENV !== 'production' || !storageAvailable()) {
    return null;
  }

  // if (!storageAvailable()) {
  //   return null;
  // }

  const prefix = getPrefix();
  const keyName = `${prefix}_${key}`;

  return JSON.parse(window.localStorage.getItem(keyName));
}

export function contains(key) {
  const val = get(key);
  return val !== null;
}

export function cleanup() {
  if (process.env.NODE_ENV !== 'production' || !storageAvailable()) {
    return;
  }

  const now = new Date().getTime();

  for (let i = 0, len = window.localStorage.length; i < len; i += 1) {
    const storageKey = window.localStorage.key(i);

    if (!storageKey.endsWith('_time')) {
      const timedStorageKey = `${storageKey}_time`;
      const storedTime = parseInt(window.localStorage.getItem(timedStorageKey), 10);

      if (isNaN(storedTime)) { // it was never set... so set it now (older versions)
        window.localStorage.setItem(timedStorageKey, `${now}`);
      } else if (now - storedTime > 2592000000) { // if it's been stored for 30 days, delete it
        window.localStorage.removeItem(storageKey);
        window.localStorage.removeItem(timedStorageKey);
      }
    }
  }
}

export default {
  put,
  get,
  contains,
  cleanup,
};
