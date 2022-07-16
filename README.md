# Prevent Action

*Prevent any action (click, focus, touch, typing, keydown, etc.) on the children of an element.*

![npm](https://img.shields.io/npm/dt/prevent-action.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/prevent-action)

```ts
import prevent from "prevent-action";

const [ preventAction, restoreAction ] = prevent();

preventAction("#element-id");
// ... do something while action is not allowed
restoreAction();
```

You can pass the **actual element** instead of the selector string.

```ts
import prevent from "prevent-action";

const element = document.querySelector("#element-id");

const [ preventAction, restoreAction ] = prevent();

preventAction(element);
// ... do something while action is not allowed
restoreAction();
```

If you don't set the element or the selector string, **document.body** will be used as a default value, which will cause **all elements** of the page to be inactive.

```ts
import prevent from "prevent-action";

const element = document.querySelector()

const [ preventAction, restoreAction ] = prevent();

preventAction(); // on document.body
// ... do something while action is not allowed
restoreAction();
```