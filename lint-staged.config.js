/** @type {import('./lib/types').Configuration} */
export default {
  '*': ['pnpm format', 'pnpm lint', 'tsc-files --noEmit']
}
