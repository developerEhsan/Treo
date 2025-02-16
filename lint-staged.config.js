/** @type {import('./lib/types').Configuration} */
export default {
  '*': 'prettier --write',
  '*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}': ['pnpm lint']
}
