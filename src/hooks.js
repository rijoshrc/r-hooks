import { useEffect, useRef, useState } from "react";
/**
 * Handle outside click event
 * @param {*} ref
 * @param {*} callback
 */
export const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (evt) => {
      if (ref.current && !ref.current.contains(evt.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
};

/**
 * Handle any JS events
 * @param {*} eventType
 * @param {*} callback
 * @param {*} element
 */
export const useEventListener = (eventType, callback, element = window) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (element == null) return;
    const handler = (e) => callbackRef.current(e);
    element.addEventListener(eventType, handler);

    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
};

/**
 * Custom hook for handling the local storage
 * Extending the useState to use local storage
 * Return the value and a method to update the value
 * Same like useState hook
 * @param {*} key
 * @param {*} initialValue
 * @returns
 */
export const useLocalStorage = (key, initialValue) => {
  // set the state if the key is in local storage
  // otherwise set the initial value
  // on error, set the initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error(err);
      return initialValue;
    }
  });

  /**
   * Set the value to local storage
   * @param {*} value
   */
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error(err);
    }
  };

  // return both the value and method to change the value
  return [storedValue, setValue];
};

/**
 * Check if online or not
 * @returns
 */
export const useOnlineStatus = () => {
  const [online, setOnline] = useState(navigator.onLine);
  useEventListener("online", () => setOnline(navigator.onLine));
  useEventListener("offline", () => setOnline(navigator.onLine));
  return online;
};

/**
 * Trigger on update
 * Extended useEffect by skipping the first render
 * @param {*} callback
 * @param {*} dependencies
 */
export const useUpdateEffect = (callback, dependencies) => {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    return callback();
  }, dependencies);
};
