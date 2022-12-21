import { AtomEffect } from "recoil";

export function localStorageEffect<T>(storeKey: string): AtomEffect<T> {
  return ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(storeKey);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(storeKey)
        : localStorage.setItem(storeKey, JSON.stringify(newValue));
    });
  };
}
