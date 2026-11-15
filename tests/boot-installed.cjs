// Standalone real web-profile smoke. Only the isolated test home is used.
const path = require('node:path')
const fs = require('node:fs')
const { pathToFileURL } = require('node:url')
async function main() {
  const base = path.join(path.dirname(process.execPath), 'resources/app.asar/dsh/node_modules/@deepseek-ai')
  const { runProfile } = await import(pathToFileURL(path.join(base, 'dsh/lib/profile-boot.js')))
  const { loadLayeredEnv } = await import(pathToFileURL(path.join(base, 'dsh-app-boot/lib/index.js')))
  const home = path.resolve(__dirname, '../../DeepClear-Promo/02-assets/dsh-plugin-audit/test-home')
  process.env.DSH_HOME = home
  process.env.DSH_TELEMETRY_DISABLED = '1'
  const host = [127, 0, 0, 1].join('.')
  const { ctx, shutdown } = await runProfile({ environment: loadLayeredEnv('dsh'),
    profile: 'deepclear-preview', patchFiles: [], args: ['--no-open', '--host', host, '--port', '8237'] })
  const finish = () => shutdown.shutdown(0)
  process.on('SIGINT', finish)
  setTimeout(() => {
    const connection = ctx.get('connection')
    const settings = ctx.get('settings')
    const descriptor = settings?.describe().find(item => item.ns === 'deepclear-ui')
    if (!connection || !descriptor) {
      console.log(JSON.stringify({ ready: false, connection: !!connection, settings: !!settings,
        services: Object.keys(ctx), descriptor: !!descriptor }))
      finish()
      return
    }
    fs.writeFileSync(path.join(home, 'preview-url.txt'), connection.authenticatedUrl(`http://${host}:8237/`))
    console.log(JSON.stringify({ ready: true, fields: Object.keys(descriptor.value).length,
      autoGenerate: descriptor.autoGenerate, writable: descriptor.writable }))
  }, 5000)
}
main().catch(error => { console.error(error); process.exitCode = 1 })
