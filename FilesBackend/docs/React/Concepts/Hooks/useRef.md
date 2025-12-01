---
title: title
tags: []
prerequisites: []
related: []
---
# useRef

```text
import { useRef} from "react"
```

Imagine you have a component that wants to track how many times it rendered. If you use a useState (renderCount, setRenderCount) and a useEffect that increments renderCount (setRenderCount((r) => r + 1), the component would load, update render count triggering another load, update render count again on the new load, and so on infinitely.

useRef is similar to useState in that it persists between renders, but it doesn't cause the component to update when something is changed. Using this:

```text
const renderCount = useRef(0) // returns an object: { current: 0 }
```

will allow us to make this useEffect:

```text
useEffect(() => {rendeerCount.current = renderCount.current + 1}
```

We can change renderCount.current as many times as we want without causing a re render. This is the basic use case for refs.

useRef can also be used to reference elements inside the html. Each html element in the jsx/tsx has a ref field. Adding one and referencing it in the html will link them:

```text
const inputRef = useRef()
...
<input ref={inputRef} />
```

Here inputRef is a DOM element lie if you used document.queryselector
