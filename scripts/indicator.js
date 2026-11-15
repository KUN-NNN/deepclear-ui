    /** Quiet, additive dot indicator. Host text and its real clock stay intact. */
    function DcOverlay() {
      const canvasRef = React.useRef(null)
      const settings = useDcSettings()
      React.useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !settings.values.thinkingSphere) return
        const context = canvas.getContext('2d')
        if (!context) return
        const motion = matchMedia('(prefers-reduced-motion: reduce)')
        let frame = 0
        let stopped = false
        const clear = () => context.clearRect(0, 0, canvas.width, canvas.height)
        const paint = now => {
          frame = 0
          if (stopped || document.hidden) return
          const dpr = Math.min(2, devicePixelRatio || 1)
          const width = innerWidth
          const height = innerHeight
          if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)
          }
          clear()
          context.setTransform(dpr, 0, 0, dpr, 0, 0)
          const cards = [...document.querySelectorAll('[data-composer-card]')].map(node => node.getBoundingClientRect())
          let visible = false
          for (const row of document.querySelectorAll('[data-chat-running]:not([data-holding])')) {
            const bounds = row.getBoundingClientRect()
            const label = row.querySelector('[class*="_runningText"]')
            if (!label || bounds.height === 0 || bounds.top < 0 || bounds.bottom > height) continue
            const text = label.getBoundingClientRect()
            const x = text.right + 17
            const y = text.top + text.height / 2
            if (x + 12 > Math.min(width, bounds.right)) continue
            if (cards.some(box => box.width && x > box.left && x < box.right && y + 12 > box.top && y - 12 < box.bottom)) continue
            visible = true
            const ink = getComputedStyle(row).getPropertyValue('--dc-accent').trim()
              || getComputedStyle(label).color
            const spin = motion.matches ? 0.35 : now / 1800
            context.fillStyle = ink
            for (let i = 0; i < 42; i++) {
              const v = 1 - 2 * (i + 0.5) / 42
              const radius = Math.sqrt(1 - v * v)
              const angle = i * 2.39996323 + spin
              const z = Math.sin(angle) * radius
              context.globalAlpha = 0.25 + (z + 1) * 0.32
              context.beginPath()
              context.arc(x + Math.cos(angle) * radius * 8, y + v * 8, 0.7, 0, Math.PI * 2)
              context.fill()
            }
            context.globalAlpha = 1
          }
          if (visible && !motion.matches) frame = requestAnimationFrame(paint)
        }
        const refresh = () => {
          if (frame) cancelAnimationFrame(frame)
          frame = 0
          if (document.hidden) clear()
          else frame = requestAnimationFrame(paint)
        }
        const observer = new MutationObserver(refresh)
        observer.observe(document.body, { childList: true, subtree: true, attributes: true,
          attributeFilter: ['data-holding', 'data-ds-dark-theme'] })
        window.addEventListener('resize', refresh)
        document.addEventListener('scroll', refresh, true)
        document.addEventListener('visibilitychange', refresh)
        motion.addEventListener('change', refresh)
        refresh()
        return () => {
          stopped = true
          cancelAnimationFrame(frame)
          observer.disconnect()
          window.removeEventListener('resize', refresh)
          document.removeEventListener('scroll', refresh, true)
          document.removeEventListener('visibilitychange', refresh)
          motion.removeEventListener('change', refresh)
        }
      }, [settings.values.thinkingSphere])
      return settings.values.thinkingSphere
        ? h('canvas', { ref: canvasRef, className: 'dc-overlay', 'aria-hidden': 'true' }) : null
    }
