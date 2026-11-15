    /**
     * Dot sphere and English status label.
     *
     * The host text keeps the real clock, so we read the elapsed seconds out of it and
     * redraw both the words and a sweeping highlight on our own overlay canvas. The host
     * label is hidden by `reading.css` while this is on; turning it off restores the host
     * row untouched and only parks the sphere to the left of the visible text.
     */
    function DcOverlay() {
      const canvasRef = React.useRef(null)
      const settings = useDcSettings()
      const sphereOn = settings.values.thinkingSphere !== false
      const labelOn = settings.values.thinkingLabel !== false
      React.useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext('2d')
        if (!context) return
        const motion = matchMedia('(prefers-reduced-motion: reduce)')
        // Wall clock anchor. The host may remount its row on every tick, so an element
        // keyed start time resets constantly; a single anchor survives those remounts
        // and is dropped as soon as the row leaves the document.
        const clock = { since: 0 }
        let frame = 0
        let stopped = false
        const clear = () => context.clearRect(0, 0, canvas.width, canvas.height)

        // The hidden host text cannot be trusted for the clock (its digits are not the
        // elapsed value), so the label counts wall time from when the running row first
        // appeared and restarts whenever the row leaves the document.
        const elapsedOf = (now) => {
          if (clock.since === 0) clock.since = now
          return Math.max(0, Math.round((now - clock.since) / 1000))
        }

        const drawSphere = (cx, cy, spin, ink) => {
          context.fillStyle = ink
          for (let index = 0; index < 42; index += 1) {
            const v = 1 - (2 * (index + 0.5)) / 42
            const ring = Math.sqrt(1 - v * v)
            const angle = index * 2.39996323 + spin
            const depth = Math.sin(angle) * ring
            context.globalAlpha = 0.25 + (depth + 1) * 0.32
            const radius = 0.8 + (depth + 1) * 0.35
            context.beginPath()
            context.arc(cx + Math.cos(angle) * ring * 8, cy + v * 8, radius, 0, Math.PI * 2)
            context.fill()
          }
          context.globalAlpha = 1
        }

        const drawLabel = (row, label, x, cy, seconds, now, ink) => {
          const style = getComputedStyle(label)
          const font = style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily
          context.font = font
          context.textBaseline = 'middle'
          const text = 'Deep thinking for ' + seconds + 's. . .'
          const width = context.measureText(text).width
          const accent = (getComputedStyle(row).getPropertyValue('--dc-accent') || '').trim() || '#7aaaff'
          const band = motion.matches ? -1e4 : ((now % 2600) / 2600) * (width + 140) - 70
          context.save()
          context.beginPath()
          context.rect(x - 2, cy - 20, width + 4, 40)
          context.clip()
          context.fillStyle = ink
          context.globalAlpha = 0.92
          context.fillText(text, x, cy)
          context.globalAlpha = 1
          const gradient = context.createLinearGradient(x + band - 70, 0, x + band + 70, 0)
          gradient.addColorStop(0, 'rgba(122, 170, 255, 0)')
          gradient.addColorStop(0.5, accent)
          gradient.addColorStop(1, 'rgba(122, 170, 255, 0)')
          context.fillStyle = gradient
          context.fillText(text, x, cy)
          context.restore()
        }

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
          const card = document.querySelector('[data-composer-card]')
          const cardTop = card === null ? height : card.getBoundingClientRect().top
          const spin = motion.matches ? 0.35 : now / 1800
          const running = document.querySelectorAll('[data-chat-running]')
          if (running.length === 0) clock.since = 0
          let visible = false
          for (const row of document.querySelectorAll('[data-chat-running]:not([data-holding])')) {
            const bounds = row.getBoundingClientRect()
            if (bounds.height === 0 || bounds.top < 0 || bounds.bottom > height) continue
            // The overlay paints above every column: never let the sphere or the label
            // sit over the composer card.
            if (bounds.bottom + 2 > cardTop) continue
            const label = row.querySelector('[class*="_runningText"]')
            if (label === null) continue
            const labelRect = label.getBoundingClientRect()
            const ink = getComputedStyle(label).color || 'rgb(200, 205, 215)'
            const size = 24
            let cx
            let cy
            if (labelOn) {
              cx = bounds.left + 2 + size / 2
              cy = bounds.top + Math.min(bounds.height, 30) / 2
            } else {
              if (labelRect.width === 0) continue
              // Keep clear of the host words: park the sphere in the gutter to their left.
              cx = Math.max(size / 2 + 6, labelRect.left - size / 2 - 8)
              cy = labelRect.top + labelRect.height / 2
            }
            visible = true
            if (sphereOn) drawSphere(cx, cy, spin, ink)
            if (labelOn) {
              const seconds = elapsedOf(now)
              const x = bounds.left + 2 + (sphereOn ? size + 8 : 0)
              drawLabel(row, label, x, cy, seconds, now, ink)
            }
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
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ['data-holding', 'data-ds-dark-theme'],
        })
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
      }, [sphereOn, labelOn])
      return sphereOn || labelOn
        ? h('canvas', { ref: canvasRef, className: 'dc-overlay', 'aria-hidden': 'true' })
        : null
    }
