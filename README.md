# React Custom Hooks

## Installation

    npm i @rrc-npm/r-hooks

or

    yarn add @rrc-npm/r-hooks

## Hooks

### useOutsideClick - [demo](https://codesandbox.io/s/useoutsideclick-8xh5e)

---

Trigger the callback function on clicking outside the referenced element.

```
// import from the package
import {useOutsideClick} from "@rrc-npm/r-hooks";

export default function Demo() {
    // define the ref
    const demoRef = useRef();

    // Handle clicking outside the element
    useOutsideClick(demoRef, () => {
        // your code
    });

    return (
        <div className="demo" ref={demoRef}>
            //....
        </div>
    );
}
```

### useEventListener - [demo](https://codesandbox.io/s/useeventlistener-jl35i)

---

Hook for handling any Javascript events.

```
useEventListener("mousedown", () => {
    // ... your code
});
```

### useLocalStorage- [demo](https://codesandbox.io/s/uselocalstorage-919mf)

---

Extended `useState` hook to keep data in the browser's `localStorage`. It can be used when a state needs to persist even after reloading the browser.

```
const [state,setState] = useLocalStorage(INITIAL_VALUE)
```

### useOnlineStatus- [demo](https://codesandbox.io/s/useonlinestatus-il29l)

---

Hook to check the network status and trigger the callback function if online.

```
    // get the status
    const isOnline = useOnlineStatus();

    // trigger on changing the status
    useEffect(() => {
        if (isOnline) console.log("You're online");
    }, [isOnline]);
```

### useUpdateEffect- [demo](https://codesandbox.io/s/useupdateeffect-qdn49)

---

An extended `useEffect` hook for triggering on updates not for initial rendering.

```
useUpdateEffect(() => {
    console.log("Updated");
}, [dependency]);
```
