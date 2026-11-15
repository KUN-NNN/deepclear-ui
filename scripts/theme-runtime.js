    // Profile settings and token layers; embedded into client.js by build-runtime.mjs.
    const DC_SETTINGS_KEY = 'deepclear-ui:settings'
    const DC_DEFAULT_SETTINGS = Object.freeze(Object.fromEntries([
      'hero', 'field', 'wave', 'ripple', 'thinkingSphere', 'thinkingLabel',
      'glass', 'effortBadge', 'bold', 'focusRing', 'diff',
      'reading', 'code',
    ].map(key => [key, true])))
    const DC_OFF_CLASS = Object.freeze(Object.fromEntries(Object.keys(DC_DEFAULT_SETTINGS)
      .map(key => [key, 'dc-off-' + key.toLowerCase()])))
    const dcSettingsListeners = new Set()
    let dcSettings = DC_DEFAULT_SETTINGS
    let dcSnapshot = { values: dcSettings, status: 'loading', writable: false, pending: false, error: '' }
    let dcWrite = null
    let dcSettingsOwner = null
    let dcTheme = null
    let dcThemeLayers = new Map()
    let dcMounted = false

    const dcReadLegacy = () => {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(DC_SETTINGS_KEY))
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return null
        const values = Object.fromEntries(Object.keys(DC_DEFAULT_SETTINGS)
          .filter(key => typeof parsed[key] === 'boolean').map(key => [key, parsed[key]]))
        return Object.keys(values).length ? values : null
      } catch { return null }
    }
    const dcLegacy = dcReadLegacy()
    dcSettings = Object.freeze({ ...DC_DEFAULT_SETTINGS, ...dcLegacy })
    dcSnapshot = { ...dcSnapshot, values: dcSettings }
    const dcSubscribeSettings = listener => {
      dcSettingsListeners.add(listener)
      return () => dcSettingsListeners.delete(listener)
    }
    const dcGetSnapshot = () => dcSnapshot
    const useDcSettings = () => React.useSyncExternalStore(dcSubscribeSettings, dcGetSnapshot, dcGetSnapshot)
    const dcModes = (light, dark) => ({ light, dark })
    const DC_CODE = {
      '--shiki-token-constant': dcModes('#2562A5', '#92BEF4'),
      '--shiki-token-string': dcModes('#326B55', '#A5CCB8'),
      '--shiki-token-comment': dcModes('#657287', '#8E9BAF'),
      '--shiki-token-keyword': dcModes('#765795', '#C0ACD8'),
      '--shiki-token-parameter': dcModes('#956032', '#D8B18A'),
      '--shiki-token-function': dcModes('#406A9D', '#A7C8F2'),
      '--shiki-token-string-expression': dcModes('#326B55', '#A5CCB8'),
      '--shiki-token-punctuation': dcModes('#546377', '#A6B2C4'),
      '--shiki-token-link': dcModes('#3269B7', '#8AB6FA'),
    }
    const DC_DIFF = {
      '--dsw-alias-file-diff-added-bg': dcModes('rgb(58 117 196 / 9%)', 'rgb(122 170 255 / 12%)'),
      '--dsw-alias-file-diff-added-gutter': dcModes('rgb(58 117 196 / 6%)', 'rgb(122 170 255 / 7%)'),
      '--dsw-alias-file-diff-added-marker': dcModes('#3269B7', '#8AB6FA'),
      '--dsw-alias-file-diff-deleted-bg': dcModes('rgb(164 97 83 / 9%)', 'rgb(213 156 139 / 10%)'),
      '--dsw-alias-file-diff-deleted-gutter': dcModes('rgb(164 97 83 / 6%)', 'rgb(213 156 139 / 6%)'),
      '--dsw-alias-file-diff-deleted-marker': dcModes('#995C50', '#D4A18F'),
      '--dsw-alias-code-diff-added': dcModes('rgb(58 117 196 / 10%)', 'rgb(122 170 255 / 13%)'),
      '--dsw-alias-code-diff-deleted': dcModes('rgb(164 97 83 / 10%)', 'rgb(213 156 139 / 11%)'),
    }
    const DC_IDENTITY = {
      '--dc-accent': dcModes('#3269B7', '#8AB6FA'),
      '--dc-focus': dcModes('rgb(50 105 183 / 18%)', 'rgb(138 182 250 / 18%)'),
    }
    function dcSyncTheme() {
      if (dcTheme === null) return
      for (const [name, enabled, tokens] of [
        ['identity', true, DC_IDENTITY],
        ['code', dcSettings.code, DC_CODE], ['diff', dcSettings.diff, DC_DIFF],
      ]) {
        if (enabled && !dcThemeLayers.has(name)) {
          dcThemeLayers.set(name, dcTheme.overrideTokens('deepclear-ui:' + name, tokens))
        } else if (!enabled && dcThemeLayers.has(name)) {
          dcThemeLayers.get(name)()
          dcThemeLayers.delete(name)
        }
      }
    }
    function dcApplySettings() {
      if (!dcMounted) return
      for (const [key, className] of Object.entries(DC_OFF_CLASS)) {
        document.documentElement.classList.toggle(className, dcSettings[key] === false)
      }
      dcSyncTheme()
    }
    function dcPublish(patch) {
      dcSnapshot = Object.freeze({ ...dcSnapshot, ...patch })
      dcSettings = dcSnapshot.values
      dcApplySettings()
      dcSettingsListeners.forEach(listener => listener())
    }
    function dcConnectSettings(scope) {
      // This is the Host patch entry id; the bundle-config key below is the package name.
      const form = scope.configForms.get('deepclear-ui')
      let active = true
      let migrating = false
      let migrationTried = false
      const adopt = () => {
        if (!active) return
        const snapshot = form.getSnapshot()
        if (snapshot.status !== 'ready' || snapshot.value === undefined) {
          dcPublish({ status: snapshot.status, writable: false })
          return
        }
        const ownsValues = Object.keys(DC_DEFAULT_SETTINGS).some(key =>
          snapshot.user !== null && typeof snapshot.user === 'object' && Object.hasOwn(snapshot.user, key))
        const legacyKeys = dcLegacy === null ? []
          : Object.keys(dcLegacy).filter(key => Object.hasOwn(DC_DEFAULT_SETTINGS, key))
        if (!migrationTried && legacyKeys.length > 0 && !ownsValues && !snapshot.value.settingsMigrated && snapshot.writable) {
          migrationTried = true
          migrating = true
          dcPublish({ status: 'ready', writable: true, pending: true, error: '' })
          // Only carry keys the current schema still owns: a legacy blob may mention
          // preferences that were removed, and one unknown path rejects the whole write.
          const ops = Object.entries(dcLegacy)
            .filter(([key]) => Object.hasOwn(DC_DEFAULT_SETTINGS, key))
            .map(([key, value]) => ({ op: 'set', path: [key], value }))
          ops.push({ op: 'set', path: ['settingsMigrated'], value: true })
          // Fence the exact snapshot that established the namespace was empty.
          const migrate = async () => form.mutate(ops, snapshot.revision)
          migrate().then(ok => {
            if (!active) return
            migrating = false
            dcPublish({ pending: false, error: ok ? '' : 'conflict' })
            adopt()
          }, () => {
            if (!active) return
            migrating = false
            dcPublish({ pending: false, error: 'save' })
            adopt()
          })
          // Keep the legacy key read-only: other profiles may share this origin.
          return
        }
        if (migrating) return
        const values = Object.freeze(Object.fromEntries(Object.entries(DC_DEFAULT_SETTINGS)
          .map(([key, fallback]) => [key, typeof snapshot.value[key] === 'boolean' ? snapshot.value[key] : fallback])))
        dcPublish({ values, status: 'ready', writable: snapshot.writable })
      }
      const write = async values => {
        if (!active || dcSnapshot.pending || dcSnapshot.status !== 'ready' || !dcSnapshot.writable) return
        dcPublish({ pending: true, error: '' })
        try {
          const ops = Object.entries(values).filter(([key, value]) => Object.hasOwn(DC_DEFAULT_SETTINGS, key) && typeof value === 'boolean')
            .map(([key, value]) => ({ op: 'set', path: [key], value }))
          ops.push({ op: 'set', path: ['settingsMigrated'], value: true })
          const ok = await form.mutate(ops, form.getSnapshot().revision)
          if (active) dcPublish({ error: ok ? '' : 'conflict' })
        } catch {
          if (active) dcPublish({ error: 'save' })
        } finally {
          if (active) { dcPublish({ pending: false }); adopt() }
        }
      }
      scope.effect(() => {
        dcWrite = write
        dcSettingsOwner = write
        const unsubscribe = form.subscribe(adopt)
        adopt()
        return () => {
          active = false
          unsubscribe()
          if (dcWrite === write) dcWrite = null
          if (dcSettingsOwner === write) {
            dcSettingsOwner = null
            dcPublish({ status: 'unavailable', writable: false, pending: false })
          }
        }
      }, 'deepclear-ui: Host preferences')
    }
    const dcSetSetting = (key, value) => dcWrite?.({ [key]: value })

    class DcBoundary extends React.Component {
      state = { failed: false }
      static getDerivedStateFromError() { return { failed: true } }
      componentDidCatch(error) { console.error('[deepclear-ui] enhancement failed', error) }
      render() { return this.state.failed ? (this.props.fallback ?? null) : this.props.children }
    }
    const dcSafe = Component => function DeepClearSafeSlot(props) {
      return h(DcBoundary, { fallback: props.children }, h(Component, props))
    }
