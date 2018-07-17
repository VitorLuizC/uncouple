import test from 'ava';
import uncouple from '../';

test('Module exports a uncouple function', (context) => {
  context.is(typeof uncouple, 'function');
});

test('Uncouple prototype methods', (context) => {
  const { filter } = uncouple(Array.prototype);
  const names = ['Vitor', 'Lucas'];

  context.deepEqual(filter(names, (name) => name === 'Vitor'), ['Vitor']);
});
