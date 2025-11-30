# useState

```text
import { useState } from "react"
```

useState is a function hook that can be destructured into an array with state at index 0 and a setter function at index 1. For example, if I have a component that can be updated and keeps track of its title, I could do:

```text
const Title = () => {
  const [title, setTitle] = useState("title1);
}
```

useState takes as arg a default state value, in this case "title1". The common practice is to destructure useState() into variableName and setVariableName. When the state changes, React automatically rerenders the component that uses it.

The state from useState is not persistent across browser reloads. Here is an example of a card that keeps track of how many times it has been clicked:

```text
const Counter = () => {
  const [count, setCount] = useState(0);
  
  return <div onClick={() => setCount(c => c + 1)}
    { count }
  </div>
}
```

Pitfalls:

```text
return <div onClick={() => count++}
```

This mutates the count variable directly and won't cause a re render.

```text
return <div onClick={() => count = count + 1}
```

This also only mutates the count variable despite reassigning it.

```text
return <div onClick={() => setCount(count++)}
```

Here count++ returns the old count and wouldn't cause the card to increment, but would cause a re render with the same value.

```text
return <div onClick={() => setCount(count + 1)}>
```

This will work in simple cases, but problems arise when many updates are happening at the same time, like if in a loop or something is clicked multiple times before a re render. State updates trigger a re render and that new state is applied after the render (state can get stale).

the functional update in the example (passing c => c + 1) has the function always retrieve the latest value of count even if a rerender hasn't happened yet.
