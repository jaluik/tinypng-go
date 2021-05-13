#!/bin/env node

import TinyPng from './TinyPng';
import { resolve } from 'path';

(function main() {
  const tinyPng = new TinyPng();
  tinyPng.setPendingList([
    {
      path: resolve(__dirname, '../__tests__/images/test.png'),
      distPath: resolve(__dirname, './output/images/test.png'),
      originSize: 376,
    },
    {
      path: resolve(__dirname, '../__tests__/no-images/no-image/b/test2.png'),
      distPath: resolve(__dirname, './output/no-images/no-image/b/test2.png'),
      originSize: 281,
    },
  ]);
  tinyPng.run();
})();
