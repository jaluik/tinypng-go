#!/bin/env node

import TinyPng from './TinyPng';
import { resolve } from 'path';

(function main() {
  const tinyPng = new TinyPng();
  tinyPng.compressSinglePic(
    resolve(__dirname, '222.png'),
    resolve(__dirname, '444.png')
  );
})();
