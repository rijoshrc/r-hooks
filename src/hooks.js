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

/**
 * Set a readonly value
 * @param {*} value
 * @returns
 */
export const useReadonly = (value) => {
  const valueRef = useRef(JSON.parse(JSON.stringify(value)));
  return valueRef.current;
};

/**
 * Get URL queries
 * @returns - query data
 */
const getQuery = () => {
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
};

/**
 * Find the URL query value of the given key
 * @param {*} key
 * @returns
 */
const getQueryStringVal = (key) => {
  return getQuery().get(key);
};

/**
 * Hook to keep values in URL query
 * @param {*} key
 * @param {*} defaultVal
 * @returns
 */
export const useQueryState = (key, defaultVal) => {
  const defaultValue = getQueryStringVal(key) || defaultVal;
  const [query, setQuery] = useState(defaultValue);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const updateUrl = (newVal) => {
    const valueToStore = newVal instanceof Function ? newVal(query) : newVal;
    setQuery(valueToStore);

    const query = getQuery();

    if (valueToStore.trim() !== "") {
      query.set(key, valueToStore);
    } else {
      query.delete(key);
    }

    // This check is necessary if using the hook with Gatsby
    if (typeof window !== "undefined") {
      const { protocol, pathname, host } = window.location;
      const newUrl = `${protocol}//${host}${pathname}?${query.toString()}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  return [query, updateUrl];
};

// Get hash value from url
const hash = window.location.hash.substr(1);

/**
 * Convert the hash values to object
 * Split the hash with &
 * Push the values as object
 */
const hashAsObject = hash
  ? hash.split("&").reduce((res, item) => {
      const parts = item.split("=");
      res[parts[0]] = parts[1];
      return res;
    }, {})
  : {};

/**
 * Check if the
 * @param {*} key
 * @returns
 */
const getHashValue = (key) => (key in hashAsObject ? hashAsObject[key] : "");

/**
 * Hook to keep the state in URL hash
 * @param {*} key
 * @param {*} defaultValue
 * @returns
 */
export const useHashState = (key, defaultValue) => {
  // keep state for handling hash
  // set default value as the current hash value, if any, or the provided default value
  const [hash, setHash] = useState(getHashValue(key) || defaultValue);

  /**
   * Update the hash value
   * @param {*} newVal
   */
  const updateHash = (newVal) => {
    // Get the new value
    // if the value is an instance function, then get value from function
    const valueToStore = newVal instanceof Function ? newVal(hash) : newVal;
    // set the value to state
    setHash(valueToStore);

    // get the current hash values as object
    let hashContent = hashAsObject;
    // update the hash with new value
    if (valueToStore.trim() !== "") {
      hashContent[key] = valueToStore;
    } else {
      delete hashContent[key];
    }

    // generate array of updated hash values
    let hashList = [];
    for (const index in hashContent) {
      if (key && key.trim() !== "") {
        hashList.push(`${index}=${hashContent[index]}`);
      }
    }
    // update the hash
    window.location.hash = hashList.join("&");
  };

  return [hash, updateHash];
};
