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

// Uses Array methods as functions for any Iterable
const { filter } = uncouple(Array.prototype);

filter(document.querySelectorAll('*'), (e) => e.tagName === 'LINK');
// => [ <a href="" />, ... ]
```

## License

Released under MIT license. You can see it [here][license].

<!-- Links -->
[license]: ./LICENSE
[ci-status]: https://travis-ci.org/VitorLuizC/uncouple
[ci-status-badge]: https://travis-ci.org/VitorLuizC/uncouple.svg?branch=master
