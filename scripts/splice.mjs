/** Replace the hero block in client.js with scripts/hero.js (build aid). */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const clientPath = join(here, '..', 'client.js')

const START = '    /* ------------------------------------------------------------ hero '
const END = '    /* ---------------------------------------------------------------- styles */'

const [client, hero] = await Promise.all([
  readFile(clientPath, 'utf8'),
  readFile(join(here, 'hero.js'), 'utf8'),
])

const start = client.indexOf(START)
const end = client.indexOf(END)
if (start < 0 || end < 0 || end <= start) throw new Error('hero markers not found')

await writeFile(clientPath, client.slice(0, start) + hero + '\n' + client.slice(end), 'utf8')
console.log(`hero block replaced (${hero.length} chars)`)
