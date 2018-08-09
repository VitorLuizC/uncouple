# Uncouple

[![Build Status][ci-status-badge]][ci-status]

Uncouple prototype methods.

## Getting Started

Install with NPM / Yarn.

```sh
npm i uncouple
# yarn add uncouple
```

Uncouple module provides a function to uncouple all prototype methods.

```js
import uncouple from 'uncouple';

const { hasOwnProperty: has } = uncouple(Object.prototype);

const o = Object.create(null);

has(o, 'name');
// => false
```

I'm also exporting a type to improve your JSDocs and TypeScript modules.

```ts
import uncouple, { Uncouple } from 'uncouple';

// Uses Array methods as functions for any Iterable.
const A: Uncouple<typeof Array.prototype> = uncouple(Array.prototype);

A.filter(document.querySelectorAll('*'), (e) => e.tagName === 'A');
// => [ <a href="" />, ... ]
```

## License

Released under MIT license. You can see it [here][license].

<!-- Links -->
[license]: ./LICENSE
[ci-status]: https://travis-ci.org/VitorLuizC/uncouple
[ci-status-badge]: https://travis-ci.org/VitorLuizC/uncouple.svg?branch=master
