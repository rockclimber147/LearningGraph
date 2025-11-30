# useCallback

useCallback memoizes a function reference similarly to useMemo.

```text
  const handleLoad = useCallback(async (path: string) => {
    if (!path) return;
    try {
      const content = await apiService.load(path);
      const blocks = editor.tryParseMarkdownToBlocks(content);
      editor.replaceBlocks(editor.document, blocks);
    } catch (err) {
      ...
    }
  }, [editor, apiService]);
```

Here the hanldleLoad function is memoized and depends on the editor and apiService. If either the editor or apiService change, the function should be recreated to use the up to date versions. If handleLoad were not used in a useCallback, it would be recreated every time the component re renders.

if handleload were to be passed into a child component, not using useCallnback in the parent would cause the child to re render with the parent as it's receiving a new instance of the function. Using useCallback, the child would receive the same function reference and not re render.

useMemo takes a callback and returns the return value of the callback whereas useCallback returns the function itself.
