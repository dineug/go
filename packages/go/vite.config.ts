// @ts-ignore
import { readFileSync } from 'node:fs';

import typescript from '@rollup/plugin-typescript';
import { visualizer } from 'rollup-plugin-visualizer';
import tspCompiler from 'ts-patch/compiler';
import { defineConfig } from 'vite';
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
        name: pkg.name,
        fileName: format => (format === 'es' ? 'go.js' : 'go.min.js'),
        formats: ['es', 'umd'],
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
      isBuild &&
        typescript({
          typescript: tspCompiler,
          noEmitOnError: true,
          compilerOptions: {
            declaration: true,
            outDir: './dist',
            plugins: [
              {
                transform: 'typescript-transform-paths',
                afterDeclarations: true,
              },
            ],
          },
        }),
    ].filter(Boolean),
    server: {
      open: true,
    },
  };
});
