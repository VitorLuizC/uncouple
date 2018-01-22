# Uncouple

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

const $Array = uncouple(Array);
const { hasOwnProperty: has } = uncouple(Object);

const phrases = document.querySelectorAll('p');

$Array.filter([...items], (p) => has(p, 'type'));
$Array.map(phrases, (phrase) => phrase.textContent);
```

## License

Released under MIT license. You can see it [here][license].

<!-- Links -->
[license]: ./LICENSE
