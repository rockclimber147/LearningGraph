---
title: title
tags: []
prerequisites: []
related: []
---
# React State

React's rendering process relies on state and props to determine when to display changes. If state has changes then react will re render everything that uses it. React state is considered immutable because only reassignments will cause a re render. For example, if you have a component that uses an array as state, the push operator will not cause a re render, only reassigning the old array to a new one that has the item you pushed.
