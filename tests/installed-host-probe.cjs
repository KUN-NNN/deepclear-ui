// Run with ELECTRON_RUN_AS_NODE=1 and the installed dsh Electron executable.
// The real installed Cordis and SettingsForms inspect a real plugin fiber;
// configEditor is an in-memory descriptor, never the user's profile document.
const path = require('node:path')
const { pathToFileURL } = require('node:url')
const assert = require('node:assert/strict')

async function main() {
  const base = path.join(path.dirname(process.execPath), 'resources/app.asar/dsh/node_modules/@deepseek-ai')
  const { Context } = await import(pathToFileURL(path.join(base, 'cordis/lib/index.js')))
  const { SettingsForms } = await import(pathToFileURL(path.join(base, 'dsh-settings/lib/index.js')))
  const plugin = await import(pathToFileURL(path.resolve(__dirname, '../index.js')))
  const ctx = new Context()
  const fork = ctx.plugin(plugin)
  await new Promise(resolve => setTimeout(resolve, 20))
  const fiber = fork.ctx.fiber
  const entry = { id: 'deepclear-ui', options: { id: 'deepclear-ui', config: {} }, fiber }
  ctx.provide('configEditor', {
    documentPath: '(in-memory)',
    configuration: () => [{ entry, inherited: {}, override: {} }],
  })
  ctx.provide('profileContext', { home: path.join(__dirname, 'nonexistent-profile'), name: 'deepclear-test' })
  ctx.provide('loader', { await: async () => {} })
  const settings = new SettingsForms(ctx)
  await new Promise(resolve => setTimeout(resolve, 20))
  const descriptor = settings.describe().find(item => item.ns === 'deepclear-ui')
  assert.ok(descriptor, 'Host exposes the plugin entry namespace')
  assert.equal(descriptor.value.hero, true)
  assert.equal(descriptor.value.reading, true)
  assert.equal(descriptor.value.settingsMigrated, false)
  assert.equal(descriptor.autoGenerate, false)
  assert.ok(JSON.stringify(descriptor.schema).includes('settingsMigrated'))
  assert.equal(typeof fiber.effectiveConfig.hero.get, 'function')
  console.log(JSON.stringify({ host: 'installed 0.2.2-rc.3', namespace: descriptor.ns,
    fields: Object.keys(descriptor.value).length, autoGenerate: descriptor.autoGenerate,
    separateSchemaPackageAccepted: true }))
  await ctx.fiber.dispose()
}
main().catch(error => { console.error(error); process.exitCode = 1 })
