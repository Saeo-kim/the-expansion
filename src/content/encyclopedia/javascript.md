---
title: "JavaScript"
description: "How the language of the web runs, including its event loop, asynchronous model, and use in browsers and on servers."
category: "Web Technologies"
slug: "javascript"
status: "published"
---

## 1. Definition

JavaScript is a dynamic, multi-paradigm programming language and the native scripting language of web [browsers](/encyclopedia/browser/). It is standardized as **ECMAScript** in the ECMA-262 specification. Despite the name, it is unrelated to Java.

It supports imperative, functional, and object-oriented styles. Objects inherit through prototypes, functions are first-class values, and types are checked at runtime.

## 2. Purpose and background

Brendan Eich created the first version at Netscape in 1995, famously in about ten days, to make web pages interactive. Standardization followed in 1997.

Two events transformed it. High-performance engines, including Google's V8 in 2008, made it fast enough for large applications. Node.js, in 2009, moved it to the [server](/encyclopedia/server/). ECMAScript 2015 then added modules, classes, arrow functions, and promises, and the language has received yearly updates since.

## 3. How it works

An engine such as V8 parses source to an abstract syntax tree, interprets bytecode, and uses just-in-time compilation to optimize frequently run code.

### 3.1 The event loop

JavaScript runs your code on a single thread per realm. Long operations are handed to the host environment, and their results are queued.

```text
Call stack   ←  Event loop  ←  Microtask queue (promises)
                            ←  Task queue (timers, input, I/O)
```

Once the stack is empty, the event loop drains **all microtasks**, and then takes **one task**. That explains this output:

```javascript
console.log('1: sync');
setTimeout(() => console.log('4: task'), 0);
Promise.resolve().then(() => console.log('3: microtask'));
console.log('2: sync');
```

The lines print in numerical order. A long-running synchronous loop blocks everything else, including clicks and rendering, which is why a page can freeze.

### 3.2 Closures

A function keeps access to the variables of the scope in which it was created:

```javascript
function createCounter() {
  let count = 0;
  return () => ++count;
}

const next = createCounter();
next(); // 1
next(); // 2
```

## 4. Internal structure of the language and its hosts

| Part | Provided by | Examples |
|---|---|---|
| Core language | ECMAScript | `Array`, `Promise`, `class` |
| Browser APIs | Web standards | DOM, `fetch`, `localStorage` |
| Server APIs | Node.js and similar runtimes | `fs`, `http`, `process` |

This division matters: `document` does not exist in Node.js, and `fs` does not exist in a browser.

The language has seven primitive types (`string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, and `null`), and everything else is an object.

Equality has two forms. `===` compares without coercion and should be the default. `==` applies conversion rules, so `0 == ''` is `true`.

## 5. Practical usage

Calling an [API](/encyclopedia/api/) and updating the page safely:

```javascript
async function showUser(id) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`/api/users/${encodeURIComponent(id)}`, {
      signal: controller.signal,
    });

    // fetch only rejects on network failure, so the status must be checked.
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const user = await response.json();
    document.querySelector('#name').textContent = user.name;
  } catch (error) {
    console.error('Could not load the user', error);
  } finally {
    clearTimeout(timeout);
  }
}
```

Run independent operations concurrently rather than awaiting them one at a time:

```javascript
const [user, posts] = await Promise.all([getUser(id), getPosts(id)]);
```

TypeScript adds static types on top of JavaScript and is widely used for larger codebases.

## 6. Relationships with other concepts

- JavaScript changes the [HTML](/encyclopedia/html/) DOM and toggles [CSS](/encyclopedia/css/) classes.
- It communicates with servers using [HTTP](/encyclopedia/http/).
- [JSON](/encyclopedia/json/) syntax derives from JavaScript object literals.
- It is an example of the [software](/encyclopedia/software/) model that uses a JIT-compiling runtime.

## 7. Advantages and limitations

**Advantages**

- Runs in every modern browser without installation.
- One language for frontend and backend.
- A very large ecosystem through npm.
- Non-blocking I/O suits servers handling many concurrent connections.

**Limitations**

- Runtime typing lets many errors go unnoticed until execution; TypeScript mitigates this.
- CPU-heavy work blocks the main thread unless moved to a Web Worker or worker thread.
- All numbers of type `number` are 64-bit floats, so integers above 2⁵³ − 1 lose precision without `BigInt`.
- Large dependency trees increase bundle size and supply-chain risk.

## 8. Common errors and troubleshooting

| Error | Typical cause | Fix |
|---|---|---|
| `TypeError: Cannot read properties of undefined` | Accessing a field on a missing value | Check the data path; use `?.` where absence is valid |
| `ReferenceError: x is not defined` | Typo, scope problem, or browser-only global | Check spelling and environment |
| `SyntaxError: Unexpected token '<'` on `response.json()` | The server returned HTML, often an error page | Log the status and the response text |
| `Promise { <pending> }` | Forgot `await` | Await the promise inside an async function |
| Blocked by CORS policy | The API did not allow this origin | Configure CORS on the server |
| `this` is undefined in a callback | Function lost its receiver | Use an arrow function or `.bind` |
| Hydration mismatch | Server and client rendered different output | Avoid using time, randomness, or `window` during render |

Use the debugger rather than only `console.log`. A `debugger;` statement pauses execution when DevTools is open, so you can inspect every variable in scope.

## 9. Learning path

1. Build a foundation in [HTML](/encyclopedia/html/) and [CSS](/encyclopedia/css/).
2. Learn values, functions, objects, and arrays.
3. Study closures, modules, and the event loop.
4. Use `fetch` with an [API](/encyclopedia/api/) that returns [JSON](/encyclopedia/json/).
5. Adopt TypeScript and a component framework.

## 10. References

- [ECMAScript Language Specification](https://tc39.es/ecma262/)
- [MDN: JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [The Modern JavaScript Tutorial](https://javascript.info/)
