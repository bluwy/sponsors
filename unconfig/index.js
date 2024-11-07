// Unbloated version of unconfig that simply imports the config with `import()`

export async function loadConfig() {
  const config = (await import('../sponsor.config.js')).default
  return { config }
}
