# useEffect

Note that in dev mode, React renders all components twice after a component mounts as a stress test to verify effect logic is implemented correctly.

```text
import { useEffect } from "react"
```

useEffect takes an effect callback function and a dependency array:

```
useEffect( () => {
  
}, []);
```

An empty dependency array means the useEffect will be run only once when the mounting of a component is complete. Adding someting to the dependency array (like count state from useState) will cause the useEffect with that dependency to be run every time the count state is updated.
