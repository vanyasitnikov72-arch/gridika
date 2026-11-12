import { build } from '../../../node_modules/.pnpm/esbuild@0.25.12/node_modules/esbuild/lib/main.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const rawPlugin = {
  name: 'raw-loader',
  setup(b) {
    b.onResolve({ filter: /\?raw$/ }, (args) => {
      const clean = args.path.replace(/\?raw$/, '');
      const full = path.resolve(args.resolveDir, clean);
      return { path: full, namespace: 'raw-file' };
    });
    b.onLoad({ filter: /.*/, namespace: 'raw-file' }, async (args) => {
      const content = await fs.promises.readFile(args.path, 'utf8');
      return { contents: `export default ${JSON.stringify(content)};`, loader: 'js' };
    });
  },
};

async function run() {
  console.log('Compiling server code compiler bundle...');
  await build({
    entryPoints: [path.join(root, 'src', 'engine', 'purchaseCode.ts')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    banner: {
      js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
    },
    plugins: [rawPlugin],
    outfile: path.resolve(root, '..', '..', 'packages', 'billing-webhook', 'codeCompiler.mjs'),
    external: ['nodemailer'],
  });
  console.log('✓ Successfully generated packages/billing-webhook/codeCompiler.mjs');
}

run().catch((err) => {
  console.error('Build error:', err);
  process.exit(1);
});
