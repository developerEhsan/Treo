/** @type {import('./lib/types').Configuration} */
export default {
  '*': [() => 'bun run typecheck', 'bun run lint', 'bun run format']
}
