import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
const root = new URL('../', import.meta.url)
const path = new URL('client.js', root)
let source = await readFile(path, 'utf8')
for (const [part, file] of [['runtime', 'theme-runtime.js'], ['indicator', 'indicator.js'], ['reading', 'reading.css']]) {
  const begin = `/* deepclear ${part}:start */`
  const finish = `/* deepclear ${part}:end */`
  const start = source.indexOf(begin)
  const end = source.indexOf(finish)
  if (start < 0 || end <= start) throw Error(`${part} markers missing`)
  const content = await readFile(new URL('scripts/' + file, root), 'utf8')
  source = source.slice(0, start) + begin + '\n' + content + '\n' + source.slice(end)
}
await writeFile(path, source, 'utf8')
console.log('Theme runtime, indicator and reading CSS embedded in ' + fileURLToPath(path))
