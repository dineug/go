// @ts-ignore
import { readFileSync } from 'node:fs';

import typescript from '@rollup/plugin-typescript';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

const pkg = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }));

const banner = `/*!
 * ${pkg.name}
 * @version ${pkg.version} | ${new Date().toDateString()}
 * @author ${pkg.author}
 * @license ${pkg.license}
 */`;

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    build: {
      lib: {
        entry: './src/index.ts',
        fileName: 'go',
        formats: ['es'],
      },
      rollupOptions: {
        output: {
          banner,
        },
      },
    },
    plugins: [
      tsconfigPaths(),
      visualizer({ filename: './dist/stats.html' }),
      dts(),
      isBuild && typescript({ noEmitOnError: true }),
    ].filter(Boolean),
    server: {
      open: true,
    },
  };
});
