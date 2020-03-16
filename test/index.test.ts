import test from 'ava';
import {
  uncoupleMethods,
  uncoupleMethodsAsCurries,
  uncoupleGetters,
  uncoupleSetters
} from '../src';

test('[uncoupleMethods]: Uncouple prototype methods from native constructors', context => {
  const { filter } = uncoupleMethods(Array);
  const names = ['Vitor', 'Lucas'];

  context.deepEqual(
    filter(names, (name: string) => name === 'Vitor'),
    ['Vitor']
  );
});

test('[uncoupleMethods]: Uncouple prototype methods from classes', context => {
  class Name {
    names: string[];

    constructor(...names: string[]) {
      this.names = names;
    }

    join(): string {
      return this.names.join(' ');
    }
  }

  const { join } = uncoupleMethods(Name);

  const name = new Name('Vitor', 'Luiz', 'Cavalcanti');

  context.deepEqual(join(name), 'Vitor Luiz Cavalcanti');
});

test('[uncoupleMethodsAsCurries]: Uncouple prototype methods from native constructors as curries', context => {
  const { filter } = uncoupleMethodsAsCurries(Array);
  const names = ['Vitor', 'Lucas'];

  context.deepEqual(filter((name: string) => name === 'Vitor')(names), [
    'Vitor'
  ]);
});

test('[uncoupleMethodsAsCurries]: Uncouple prototype methods from classes', context => {
  class Name {
    names: string[];

    constructor(...names: string[]) {
      this.names = names;
    }

    join(): string {
      return this.names.join(' ');
    }
  }

  const { join } = uncoupleMethodsAsCurries(Name);

  const name = new Name('Vitor', 'Luiz', 'Cavalcanti');

  context.deepEqual(join()(name), 'Vitor Luiz Cavalcanti');
});

test('[uncoupleGetters]: Uncouple getters as functions', context => {
  class Name {
    names: string[];

    constructor(...names: string[]) {
      this.names = names;
    }

    get name(): string {
      return this.names.join(' ');
    }
  }

  const { getName } = uncoupleGetters(Name);

  context.deepEqual(
    getName(new Name('Vitor', 'Luiz', 'Cavalcanti')),
    'Vitor Luiz Cavalcanti'
  );
});

test('[uncoupleSetters]: Uncouple setters as functions', context => {
  class Name {
    names: string[];

    constructor(...names: string[]) {
      this.names = names;
    }

    set lastName(lastName: string) {
      this.names.push(lastName);
    }
  }

  const { setLastName } = uncoupleSetters(Name);

  const name = new Name('Vitor', 'Luiz');

  setLastName(name, 'Cavalcanti');

  context.deepEqual(name.names[name.names.length - 1], 'Cavalcanti');
});
