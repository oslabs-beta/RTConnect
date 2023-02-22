import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  // 'testEnvironment': 'jsdom'
};

export default jestConfig;