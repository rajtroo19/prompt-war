import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  roots: ['<rootDir>/__tests__'],
  testPathIgnorePatterns: ['/node_modules/', 'setup\\.ts$'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
    },
  },
};

export default config;
