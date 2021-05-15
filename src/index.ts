#!/usr/bin/env node

import { Command } from 'commander';
import { fstat, stat } from 'fs-extra';
import TinyPng from './TinyPng';
import { getFullPath, findAllImageFile } from './utils';

(function main() {
  const program = new Command();
  program
    .version('0.1.0', '-v, --version', 'output the current version')
    .arguments('<file>')
    .option('-o, --output <output>', 'set output path')
    .option('-m, --max [max]', 'set max handled count')
    .description('A cli util to compress image', {
      file: 'input file path',
    })
    .action((file, options) => {
      const { output = file, max = 10 } = options;
      const originPath = getFullPath(file);
      stat(originPath)
        .then(async (stats) => {
          let pendingList;
          if (stats.isDirectory()) {
            pendingList = (await findAllImageFile(originPath)).map((item) => ({
              ...item,
              distPath: item.path.replace(originPath, getFullPath(output)),
            }));
          }
          if (stats.isFile()) {
            pendingList = [
              {
                path: originPath,
                originSize: stats.size,
                distPath: getFullPath(output),
              },
            ];
          }

          const tinyPng = new TinyPng(max);
          tinyPng.setPendingList(pendingList);
          tinyPng.run();
        })
        .catch((err) => {
          console.log(err);
        });
    });

  program.parse();
})();
