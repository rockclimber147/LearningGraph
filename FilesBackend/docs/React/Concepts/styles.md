# React Styles

## index.css

index.css has global styles for the entire app, if imported in App.tsx.

## Inline Styles

inline styles are given as objects in .jsx/.tsx files. They are defined in camel case instead of hyphen case, for example:

```
<div style="justify-content: center;"> example </div>
```

becomes

```
<div style={{ justifyContent: center }}> example </div>
```
