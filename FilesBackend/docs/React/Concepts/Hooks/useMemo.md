# useMemo

This hook memoizes a value returned by a function. It caches the results of a function so it's only recalculated when the dependencies change. It can prevent unnecessary function calls when a re render happens.

```text
import { useMemo } from "react"
...

  const [count, setCount] = useState(0);
  const [number, setNumber] = useState(0);

  const squaredNumber = useMemo(() => {
    // code that takes way too long to run here
    return number * number;
  }, [number]);
```

In the above example, if count changes the squaredNumber function is not called. It is only called if number changes. Generally, updating state in react re renders the entire component. If count is updated but number stays the same, we don't need to call the squaredNumber function again.

UseMemo adds overhead and stores memory so it's not a great idea to use it everywhere, just in computationally heavy cases where an output is determined entirely by an input (like in the squaredNumber case). If squaredNumber was instead an api call with results that can change (like get the current time), useMemo shouldn't be used here.

`useMemo` can also ensure referential equality. Declaring an object inside a component and using it as a dependency in `useEffect` will trigger the effect on every render because the object gets a new reference each time. Wrapping the object creation in `useMemo` ensures that the object keeps the same reference across renders, so `useEffect` only runs when the actual contents change.

```text
import { useMemo, useEffect, useState } from "react";

function MyComponent({ value }) {
  const [count, setCount] = useState(0);

  // Without useMemo, this object gets recreated every render
  const obj = useMemo(() => ({ value }), [value]);

  useEffect(() => {
    console.log("obj changed!");
  }, [obj]); // Will only run when 'value' changes

  return <button onClick={() => setCount(count + 1)}>Click</button>;
}
```
