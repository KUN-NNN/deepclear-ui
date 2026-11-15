import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFile } from 'node:fs/promises'
import React from 'react'
import { Config } from '../index.js'

const source = await readFile(new URL('../client.js', import.meta.url), 'utf8')
const settle = async () => { await new Promise(resolve => setTimeout(resolve, 0)) }
const defaults = () => Object.fromEntries(Object.entries(Config({})).map(([key, value]) => [key, value.get()]))

function environment({ legacy, user = {}, writable = true, status = 'ready', fail, holdMigration = false } = {}) {
  const classes = new Set()
  const styles = new Set()
  const slots = new Map()
  const listeners = new Set()
  const layers = new Map()
  const mutations = []
  const storageWrites = []
  let snapshot = { status, writable, value: { ...defaults(), ...user }, user, revision: 7 }
  let release = null
  const form = {
    getSnapshot: () => snapshot,
    subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener) },
    async mutate(ops, revision) {
      mutations.push({ ops, revision })
      if (holdMigration && !release) await new Promise(resolve => { release = resolve })
      if (fail === 'throw') throw Error('offline')
      if (fail === 'refuse' || revision !== snapshot.revision) return false
      const patch = Object.fromEntries(ops.map(op => [op.path[0], op.value]))
      snapshot = { ...snapshot, value: { ...snapshot.value, ...patch }, user: { ...snapshot.user, ...patch }, revision: snapshot.revision + 1 }
      listeners.forEach(listener => listener())
      return true
    },
  }
  const document = {
    documentElement: { lang: 'en', classList: {
      toggle: (name, force) => force ? classes.add(name) : classes.delete(name),
      remove: name => classes.delete(name),
    } },
    head: { append: node => styles.add(node) },
    createElement: () => { const node = { dataset: {}, remove: () => styles.delete(node) }; return node },
  }
  const sandbox = {
    window: { localStorage: {
      getItem: () => legacy === undefined ? null : typeof legacy === 'string' ? legacy : JSON.stringify(legacy),
      setItem: (...args) => storageWrites.push(args), removeItem: (...args) => storageWrites.push(args),
    }, __ModuleLoader__: { load(entry) { sandbox.plugin = entry.factory(name => {
      if (name === 'react') return React
      if (name === 'react-dom') return {}
      throw Error(name)
    }) } } }, document, navigator: { language: 'en' }, console,
  }
  vm.createContext(sandbox)
  vm.runInContext(source, sandbox)
  const effects = []
  const scoped = () => ({
    effect(fn) { const dispose = fn(); effects.push(dispose); return dispose },
    theme: { overrideTokens(name, tokens) {
      const layer = { tokens }
      layers.set(name, layer)
      return () => { if (layers.get(name) === layer) layers.delete(name) }
    } },
    configForms: { get(id) { assert.equal(id, 'deepclear-ui'); return form } },
  })
  const ctx = {
    ...scoped(),
    inject(deps, fn) { return fn(scoped()) },
    slots: {
      inject(name, fn) { return fn() },
      register(options, Component) {
        slots.set(options.name, { options, Component })
        const dispose = () => slots.delete(options.name)
        effects.push(dispose)
        return dispose
      },
    },
  }
  sandbox.plugin.apply(ctx)
  // Reach the public configuration component through its registered ErrorBoundary wrapper.
  const settings = () => {
    const wrapped = slots.get('plugins.bundle.config').Component({})
    const Component = wrapped.props.children.type
    // Hooks are verified in the browser with real React; no hooks are invoked here.
    return Component
  }
  return {
    classes, styles, slots, layers, mutations, storageWrites, form, settings,
    get snapshot() { return snapshot },
    update(patch) { snapshot = { ...snapshot, ...patch }; listeners.forEach(listener => listener()) },
    release: () => release?.(),
    dispose: () => effects.reverse().forEach(dispose => { if (typeof dispose === 'function') dispose() }),
  }
}

test('fresh profile registers separately disposable identity/code/diff layers and settings entry', () => {
  const e = environment()
  assert.equal(e.layers.size, 3)
  assert.equal(e.slots.get('plugins.bundle.config').options.key, 'deepclear-ui')
  assert.equal(e.mutations.length, 0)
  e.dispose()
  assert.equal(e.layers.size, 0)
  assert.equal(e.styles.size, 0)
  assert.equal(e.slots.size, 0)
  assert.equal(e.classes.size, 0)
})

test('legacy migration is atomic, revision fenced and keeps the old origin key read-only', async () => {
  const e = environment({ legacy: { diff: false, stats: false, unknown: false } })
  await settle()
  assert.equal(e.mutations.length, 1)
  assert.equal(e.mutations[0].revision, 7)
  assert.equal(e.snapshot.value.diff, false)
  assert.equal(e.snapshot.value.stats, false)
  assert.equal(e.snapshot.value.settingsMigrated, true)
  assert.equal(e.layers.has('deepclear-ui:diff'), false)
  assert.ok(e.classes.has('dc-off-stats'))
  assert.equal(e.storageWrites.length, 0)
  assert.equal(e.mutations[0].ops.some(op => op.path[0] === 'unknown'), false)
  e.dispose()
})

test('existing Host overrides win even when identical to defaults', async () => {
  const e = environment({ legacy: { diff: false }, user: { diff: true } })
  await settle()
  assert.equal(e.mutations.length, 0)
  assert.equal(e.layers.has('deepclear-ui:diff'), true)
  e.dispose()
})

test('late Host snapshot updates theme layers and toggles; disabling diff retains syntax palette', () => {
  const e = environment({ status: 'loading' })
  e.update({ status: 'ready', value: { ...defaults(), diff: false }, writable: true })
  assert.equal(e.layers.has('deepclear-ui:diff'), false)
  assert.equal(e.layers.has('deepclear-ui:code'), true)
  e.update({ value: defaults() })
  assert.equal(e.layers.has('deepclear-ui:diff'), true)
  assert.equal(e.classes.has('dc-off-diff'), false)
  e.dispose()
})

test('migration refusal and transport failure settle without loops or local fake writes', async () => {
  for (const fail of ['refuse', 'throw']) {
    const e = environment({ legacy: { diff: false }, fail })
    await settle()
    assert.equal(e.mutations.length, 1)
    assert.equal(e.snapshot.value.diff, true)
    assert.equal(e.storageWrites.length, 0)
    e.dispose()
  }
})

test('read-only Host never receives a migration write', async () => {
  const e = environment({ legacy: { diff: false }, writable: false })
  await settle()
  assert.equal(e.mutations.length, 0)
  e.dispose()
})

test('a competing window write wins against a queued legacy migration', async () => {
  const e = environment({ legacy: { diff: false }, holdMigration: true })
  e.update({ revision: 8, user: { diff: true }, value: defaults() })
  e.release()
  await settle()
  assert.equal(e.snapshot.value.diff, true)
  assert.equal(e.mutations.length, 1)
  e.dispose()
})

test('unloading during a migration cannot re-add token layers or feature classes', async () => {
  const e = environment({ legacy: { diff: false }, holdMigration: true })
  e.dispose()
  e.release()
  await settle()
  assert.equal(e.layers.size, 0)
  assert.equal(e.classes.size, 0)
})

test('malformed legacy settings cannot break plugin startup', () => {
  for (const legacy of ['null', '{bad', '[]']) {
    const e = environment({ legacy })
    assert.equal(e.styles.size, 1)
    e.dispose()
  }
})

test('removed surface preferences in old profiles cannot restore deleted features', async () => {
  const e = environment({ legacy: { palette: true, instrument: true, diff: false }, user: { palette: true, instrument: true } })
  await settle()
  for (const key of ['palette', 'instrument']) {
    assert.equal(Object.hasOwn(defaults(), key), false)
    assert.equal(e.layers.has('deepclear-ui:' + key), false)
    assert.equal(e.mutations[0].ops.some(op => op.path[0] === key), false)
  }
  assert.equal(e.slots.has('sidebar.session.action'), false)
  assert.equal(e.slots.has('conversation.input.overlay'), false)
  e.dispose()
})
