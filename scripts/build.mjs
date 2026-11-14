/**
 * Splice the generated mascot grid and its dimensions into client.js.
 *
 * scripts/girl-meta.json holds the grid size and scripts/girl-grid.txt holds one
 * hex digit per cell (0 = empty); this writes both into the placeholders. Run
 * after `python scripts/build_girl.py`.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const clientPath = join(here, '..', 'client.js')

const [meta, grid, lines, source] = await Promise.all([
  readFile(join(here, 'girl-meta.json'), 'utf8').then(text => JSON.parse(text)),
  readFile(join(here, 'girl-grid.txt'), 'utf8'),
  readFile(join(here, 'girl-lines.txt'), 'utf8'),
  readFile(clientPath, 'utf8'),
])

const cells = grid.trim()
const strokes = lines.trim()
for (const [name, value] of [['girl-grid.txt', cells], ['girl-lines.txt', strokes]]) {
  if (!/^[0-9a-f]+$/.test(value)) throw new Error(`${name} must be lowercase hex digits`)
  if (value.length !== meta.columns * meta.rows) {
    throw new Error(`${name} has ${value.length} cells, expected ${meta.columns * meta.rows}`)
  }
}

for (const placeholder of ['__GIRL_COLUMNS__', '__GIRL_ROWS__', '__GIRL_GRID__', '__GIRL_LINES__']) {
  if (!source.includes(placeholder)) throw new Error(`${placeholder} placeholder not found`)
}

const next = source
  .replace('__GIRL_COLUMNS__', String(meta.columns))
  .replace('__GIRL_ROWS__', String(meta.rows))
  .replace("'__GIRL_GRID__'", `'${cells}'`)
  .replace("'__GIRL_LINES__'", `'${strokes}'`)

await writeFile(clientPath, next, 'utf8')
console.log(`mascot grids spliced (${meta.columns}x${meta.rows}, ${cells.length} cells each)`)
