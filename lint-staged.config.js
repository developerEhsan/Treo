/** @type {import('./lib/types').Configuration} */
export default {
  // '*': [() => 'bun run typecheck', 'bun run lint', 'bun run format']
  '*': (files) => {
    const all = files.join(' ')
    const jsTs = files.filter((f) => /\.(?:js|jsx|ts|tsx)$/.test(f)).join(' ')
    const cmds = []
    // Run once per commit
    cmds.push('bun run typecheck')
    if (jsTs) cmds.push(`bunx eslint --fix ${jsTs}`)
    if (all) cmds.push(`bunx prettier --write ${all}`)
    return cmds
  }
}
