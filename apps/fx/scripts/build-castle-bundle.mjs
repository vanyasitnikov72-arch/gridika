import { build } from '../../../node_modules/.pnpm/esbuild@0.25.12/node_modules/esbuild/lib/main.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const threeGlobalPlugin = {
  name: 'three-global',
  setup(b) {
    b.onResolve({ filter: /^three$/ }, () => ({ path: 'three', namespace: 'three-global' }));
    b.onLoad({ filter: /.*/, namespace: 'three-global' }, () => ({
      contents: `
var T = typeof window !== 'undefined' ? (window.THREE || {}) : {};
if (!T.MathUtils) T.MathUtils = T.Math || {};
if (!T.MathUtils.degToRad) T.MathUtils.degToRad = function(d) { return d * (Math.PI / 180); };
if (!T.MathUtils.lerp) T.MathUtils.lerp = function(x, y, t) { return x + (y - x) * t; };
if (!T.MathUtils.clamp) T.MathUtils.clamp = function(v, min, max) { return Math.max(min, Math.min(max, v)); };
if (!T.MathUtils.smoothstep) T.MathUtils.smoothstep = function(x, min, max) {
  if (x <= min) return 0;
  if (x >= max) return 1;
  var t = (x - min) / (max - min);
  return t * t * (3 - 2 * t);
};
module.exports = T;
      `,
      loader: 'js',
    }));
  },
};

async function run() {
  console.log('Compiling castle standalone bundle with window.THREE...');
  await build({
    entryPoints: [path.join(root, 'src', 'embed', 'castleViewerEntry.ts')],
    bundle: true,
    format: 'iife',
    globalName: 'GridikaCastleModule',
    plugins: [threeGlobalPlugin],
    outfile: path.join(root, 'src', 'embed', 'castleRuntime.iife.js'),
    minify: true,
  });
  console.log('✓ Successfully generated castleRuntime.iife.js using window.THREE');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
