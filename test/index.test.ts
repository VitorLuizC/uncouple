import test from 'ava';
import uncouple from '../src';

test('Module exports a uncouple function', (context) => {
  context.is(typeof uncouple, 'function');
});

test('Uncouple prototype methods from native constructors', (context) => {
  const { filter } = uncouple(Array);
  const names = ['Vitor', 'Lucas'];

  context.deepEqual(filter(names, (name) => name === 'Vitor'), ['Vitor']);
});

test('Uncouple prototype methods from classes', (context) => {
  class Name {
    names: string[];

    constructor (...names: string[]) {
      this.names = names;
    }

    join (): string {
      return this.names.join(' ');
    }
  }

  const { join } = uncouple(Name);

  const name = new Name('Vitor', 'Luiz', 'Cavalcanti');

  context.deepEqual(join(name), 'Vitor Luiz Cavalcanti');
});
