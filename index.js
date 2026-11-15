import Schema from '@deepseek-ai/schemastery'

/** Profile-owned preferences. Volatile fields update without restarting the UI. */
export const Config = Schema.object(Object.fromEntries([
  'hero', 'field', 'wave', 'ripple', 'thinkingSphere', 'thinkingLabel',
  'composerField', 'glass', 'bold', 'focusRing', 'diff', 'stats',
  'reading', 'code',
].map(key => [key, Schema.boolean().default(true).volatile()]).concat([
  ['settingsMigrated', Schema.boolean().default(false).volatile().hidden()],
])))

export function apply(ctx) {
  ctx.inject(['settings'], scope => {
    scope.effect(() => scope.settings.configure({ auto: false }, ctx.fiber), 'deepclear-ui: preferences')
  })
}
