/** @type {import('./lib/types').Configuration} */
export default {
  '*': 'pnpm format',
  '*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}': ['pnpm lint']
}
