import { name } from './package.json';
import { Config as Configuration } from 'bili';

const configuration: Configuration = {
  banner: true,
  input: 'src/index.ts',
  output: {
    format: ['es', 'cjs', 'umd', 'umd-min'],
    moduleName: name
  },
  plugins: {
    typescript2: {
      clean: true,
      tsconfig: 'tsconfig.bundle.json',
      useTsconfigDeclarationDir: true
    }
  },
  babel: {
    minimal: true
  }
};

export default configuration;
