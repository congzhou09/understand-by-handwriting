import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  bail: 1,
  testEnvironment: 'jsdom',
  roots: ['./src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
};

export default config;
