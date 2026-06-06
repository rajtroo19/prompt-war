// Mock localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

import '@testing-library/jest-dom';
import React from 'react';

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    __esModule: true,
    ...actual,
    AnimatePresence: ({ children }: any) => children,
    motion: {
      ...actual.motion,
      div: React.forwardRef(({ initial, animate, exit, transition, whileHover, ...props }: any, ref: any) => 
        React.createElement('div', { ref, ...props })
      ),
    },
  };
});
