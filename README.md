# Uncouple

[![Build Status](https://travis-ci.org/VitorLuizC/uncouple.svg?branch=master)](https://travis-ci.org/VitorLuizC/uncouple)
[![License](https://badgen.net/github/license/VitorLuizC/uncouple)](./LICENSE)
[![Library minified size](https://badgen.net/bundlephobia/min/uncouple)](https://bundlephobia.com/result?p=uncouple)
[![Library minified + gzipped size](https://badgen.net/bundlephobia/minzip/uncouple)](https://bundlephobia.com/result?p=uncouple)

Uncouple constructors and classes methods into functions.

## Installation

This library is published in the NPM registry and can be installed using any compatible package manager.

```sh
npm install uncouple --save

# For Yarn, use the command below.
yarn add uncouple
```

### Installation from CDN

This module has an UMD bundle available through JSDelivr and Unpkg CDNs.

```html
<!-- For UNPKG use the code below. -->
<script src="https://unpkg.com/uncouple"></script>

<!-- For JSDelivr use the code below. -->
<script src="https://cdn.jsdelivr.net/npm/uncouple"></script>

<script>
  // UMD module is exposed through the "uncouple" global function.
  console.log(uncouple);

  var O = uncouple(Object);
  var isFetchDefined = O.hasOwnProperty(window, 'fetch');
</script>
```

## Usage

Module default exports uncouple function.

`uncouple` receives a constructor or a class as argument and returns an object with its uncoupled methods.

```js
import uncouple from 'uncouple';

const O = uncouple(Object);
// => {
//   hasOwnProperty: ƒ ()
//   isPrototypeOf: ƒ ()
//   propertyIsEnumerable: ƒ ()
//   toLocaleString: ƒ ()
//   toString: ƒ ()
//   valueOf: ƒ ()
// }

const hasFetch = O.hasOwnProperty(window, 'fetch');
// => true
```

All uncoupled methods receives an instance as first argument followed by method arguments.

```js
const { trim, substr } = uncouple(String);

trim('   Okay    ');
//=> 'Okay'

substr('ABCDEF', -3);
//=> 'CDF'
```

It also works for Function constructors and classes.

```js
function User(name) {
  this.name = name;
}

User.prototype.getName = function() {
  console.log(this.name);
};

const { getName } = uncouple(User);

getName(new User('João'));
//=> 'João'

class Car {
  speed = 0;

  acelerate(speed) {
    this.speed += speed;
  }
}

const { acelerate } = uncouple(Car);

const uno = new Car();

acelerate(uno, 120);
acelerate(uno, 60);

uno.speed;
//=> 180
```

## Use cases

You can reuse methods with duck types, like Array.prototype.filter in a NodeList.

```js
const { filter } = uncouple(Array);

const anchors = document.getElementsByTagName('a');
//=> NodeListOf<HTMLAnchorElement>

const isLink = anchor => /^https?:\/\//.test(anchor.href);

const links = filter(anchors, isLink);
//=> Array<HTMLAnchorElement>
```

Compositions and smart pipelines became pretty and readable with uncoupled methods.

```js
const {
  trim,
  replace,
  normalize,
  toLocaleLowerCase
} = uncouple(String);

" Olá, como vai  vocÊ?"
|> normalize(#, 'NFKD')
|> replace(#, /[\u0080-\uF8FF]/g, '')
|> trim
|> replace(#, /\s+/g, ' ')
|> toLocaleLowerCase
//=> 'ola, como vai voce?'

const normalize = compose(
  toLocaleLowerCase,
  (value) => replace(value, /\s+/g, ' '),
  trim,
  (value) => replace(value, /[\u0080-\uF8FF]/g, '')
  (value) => normalize(value, 'NFKD'),
);

normalize(' Meu nome é Vitor   , meus bons')
//=> 'meu nome e vitor, meus bons'
```

With `uncouple` you can call `Object` methods with `Object.create(null)`, which returns an empty object without prototype.

```js
const user = Object.create(null);

user.name = '@VitorLuizC';

user.hasOwnProperty('name');
//=> throws TypeError: user.hasOwnProperty is not a function

const { hasOwnProperty: has } = uncouple(Object);

has(user, 'name');
//=> true
```

## License

Released under [MIT License](./LICENSE).
