    /* ------------------------------------------------------------ hero mascot */

    /** Dot grid sampled from the mascot artwork: one hex digit per cell. */
    const GIRL_COLUMNS = __GIRL_COLUMNS__
    const GIRL_ROWS = __GIRL_ROWS__
    const GIRL_GRID = '__GIRL_GRID__'
    const GIRL_LINES = '__GIRL_LINES__'

    /** Grid aspect (width / height), used to keep the portrait undistorted. */
    const GIRL_ASPECT = GIRL_COLUMNS / GIRL_ROWS

    /** Wordmark set in dots on the left: two lines, sampled from live text. */
    const LOCKUP_LINES = ['deepseek', 'harness']
    const LOCKUP_COLUMNS = 140
    const LOCKUP_ROWS = 58

    /** Alpha buckets drawn per frame, so the twinkle costs one fill per level. */
    const LEVELS = 7
    const TAU = Math.PI * 2

    /**
     * Twinkle refresh rate. The field is dense, so the frame budget is kept
     * loose: slow alpha breathing reads the same at 16 fps, and the canvas is
     * only alive while the blank home is on screen.
     */
    const FRAME_MS = 1000 / 16

    /** One dot's cell in CSS pixels: fixed, so dots never scale with the window. */
    const DOT_PITCH = 9

    /** Smallest dot pitch the wordmark may use before it is dropped. */
    const TEXT_MIN_PITCH = 3.6

    /** Wordmark assembly: dots reveal left to right over this long. */
    const ASSEMBLY_MS = 1000

    /** Each line's slice of the assembly, in timeline fractions: line 1 starts
     *  while line 0 is still finishing, so the two never pop at once. */
    const ASSEMBLY_SECOND_LINE = 0.42
    const ASSEMBLY_LINE_SPAN = 0.58

    /** Temporary on-canvas readout used to diagnose layout mismatches. */
    const DEBUG = false

    /** Dot model of the portrait for the light canvas (ink-weighted). */
    let dotModel

    /** Dot model of the portrait for the dark canvas (line-art weighted). */
    let lineModel

    /** Dot model of the wordmark, built once by rasterising live text. */
    let lockupModel

    /**
     * Decode one hex grid into dots: one dot per non-empty cell, weight from the
     * digit, each with its own twinkle phase and speed so the field never blinks
     * in unison.
     * @param cells - one hex digit per grid cell, row-major.
     * @returns dots in normalised space (`u`/`v` 0..1, `a` weight 0..1).
     */
    function decodeGrid(cells) {
      const dots = []
      for (let index = 0; index < cells.length; index += 1) {
        const weight = Number.parseInt(cells[index], 16)
        if (!(weight > 0)) continue
        const row = Math.floor(index / GIRL_COLUMNS)
        const column = index % GIRL_COLUMNS
        dots.push({
          u: (column + 0.5) / GIRL_COLUMNS,
          v: (row + 0.5) / GIRL_ROWS,
          a: weight / 15,
          phase: Math.random() * TAU,
          speed: 0.5 + Math.random() * 0.8,
        })
      }
      return dots
    }

    /**
     * Light canvas: the artwork's ink drives dot weight, so dark hair and the
     * dark dress read dark on the pale canvas.
     * @returns dots in normalised space.
     */
    function mascotDots() {
      if (dotModel === undefined) dotModel = decodeGrid(GIRL_GRID)
      return dotModel
    }

    /**
     * Dark canvas: the dots are light, so the artwork's ink is inverted — skin
     * and the white apron become dense bright dots while ink-heavy hair and the
     * dress fade back into the canvas. Cells with no ink but enclosed by the
     * figure count as full weight, which is what keeps the face from turning
     * into an empty hole.
     * @returns dots in normalised space.
     */
    function invertedDots() {
      if (lineModel !== undefined) return lineModel
      const total = GIRL_COLUMNS * GIRL_ROWS
      const occupied = new Uint8Array(total)
      const weight = new Float32Array(total)
      for (let index = 0; index < GIRL_GRID.length && index < total; index += 1) {
        const value = Number.parseInt(GIRL_GRID[index], 16)
        if (!(value > 0)) continue
        occupied[index] = 1
        weight[index] = value / 15
      }
      const rowFirst = new Int32Array(GIRL_ROWS).fill(-1)
      const rowLast = new Int32Array(GIRL_ROWS).fill(-1)
      const columnFirst = new Int32Array(GIRL_COLUMNS).fill(-1)
      const columnLast = new Int32Array(GIRL_COLUMNS).fill(-1)
      for (let row = 0; row < GIRL_ROWS; row += 1) {
        for (let column = 0; column < GIRL_COLUMNS; column += 1) {
          if (occupied[row * GIRL_COLUMNS + column] === 0) continue
          if (rowFirst[row] < 0) rowFirst[row] = column
          rowLast[row] = column
          if (columnFirst[column] < 0) columnFirst[column] = row
          columnLast[column] = row
        }
      }
      const dots = []
      for (let row = 0; row < GIRL_ROWS; row += 1) {
        for (let column = 0; column < GIRL_COLUMNS; column += 1) {
          if (row < columnFirst[column] || row > columnLast[column]) continue
          if (column < rowFirst[row] || column > rowLast[row]) continue
          const index = row * GIRL_COLUMNS + column
          const alpha = occupied[index] === 1 ? 1 - weight[index] : 1
          if (alpha < 0.45) continue
          dots.push({
            u: (column + 0.5) / GIRL_COLUMNS,
            v: (row + 0.5) / GIRL_ROWS,
            a: alpha,
            phase: Math.random() * TAU,
            speed: 0.5 + Math.random() * 0.8,
          })
        }
      }
      lineModel = dots
      return dots
    }

    /**
     * Rasterise the two wordmark lines with the UI font and reduce them to the
     * same dotted grid the portrait uses.
     * @returns dots in normalised block space (`u`/`v` 0..1, `a` weight 0..1).
     */
    function lockupDots() {
      if (lockupModel !== undefined) return lockupModel
      const supersample = 4
      const family = '"Segoe UI", system-ui, sans-serif'
      // Display treatment: heavy italic with wide tracking, filled solid. Each
      // line is rasterised on its own canvas, so a descender that crosses the
      // other line's band still belongs to its own colour.
      const style = 'italic 700'
      const probe = document.createElement('canvas').getContext('2d')
      probe.font = `${style} 100px ${family}`
      if ('letterSpacing' in probe) probe.letterSpacing = '6px'
      const width = LOCKUP_COLUMNS * supersample
      const height = LOCKUP_ROWS * supersample
      const widest = Math.max(...LOCKUP_LINES.map(line => probe.measureText(line).width), 1)
      const size = ((width * 0.94) / widest) * 100
      const model = LOCKUP_LINES.map((line, lineIndex) => {
        const big = document.createElement('canvas')
        big.width = width
        big.height = height
        const bigContext = big.getContext('2d')
        bigContext.textAlign = 'left'
        bigContext.textBaseline = 'middle'
        if ('letterSpacing' in bigContext) bigContext.letterSpacing = '6px'
        bigContext.font = `${style} ${size.toFixed(1)}px ${family}`
        bigContext.fillStyle = 'rgba(255, 255, 255, 0.92)'
        bigContext.fillText(line, width * 0.02, height * (0.34 + 0.4 * lineIndex))

        const small = document.createElement('canvas')
        small.width = LOCKUP_COLUMNS
        small.height = LOCKUP_ROWS
        const smallContext = small.getContext('2d')
        smallContext.drawImage(big, 0, 0, LOCKUP_COLUMNS, LOCKUP_ROWS)
        const pixels = smallContext.getImageData(0, 0, LOCKUP_COLUMNS, LOCKUP_ROWS).data
        const dots = []
        for (let index = 0; index < LOCKUP_COLUMNS * LOCKUP_ROWS; index += 1) {
          const alpha = pixels[index * 4 + 3] / 255
          if (alpha < 0.08) continue
          dots.push({
            u: ((index % LOCKUP_COLUMNS) + 0.5) / LOCKUP_COLUMNS,
            v: (Math.floor(index / LOCKUP_COLUMNS) + 0.5) / LOCKUP_ROWS,
            a: Math.min(1, alpha * 1.25),
            phase: Math.random() * TAU,
            speed: 0.5 + Math.random() * 0.8,
          })
        }
        return dots
      })
      lockupModel = model
      return model
    }

    /**
     * Paint the dot mascot and wordmark into a canvas, twinkling in place.
     * @param canvas - the frame canvas sized to the conversation area.
     * @returns disposer that cancels the animation and observers.
     */
    function attachMascot(canvas) {
      const context = canvas.getContext('2d')
      if (context === null) return () => {}
      const portraitLight = mascotDots()
      const portraitDark = invertedDots()
      const wordmark = lockupDots()
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const started = performance.now()
      let width = 1
      let height = 1
      let dpr = 1
      let frame = 0
      let drawnAt = 0
      let disposed = false
      /** Composer card geometry in canvas coordinates; the composition's bound. */
      let composerLeft = 0
      let composerWidth = 0
      let composerTop = 0
      let composerNode = null
      const composerObserver = new ResizeObserver(() => { readComposer() })

      /** Re-read the composer card (it mounts with the hero and resizes with it). */
      const readComposer = () => {
        const canvasRect = canvas.getBoundingClientRect()
        // Pick the composer card that actually overlaps this conversation area:
        // hidden or off-screen cards (other panels, mounted shells) must not
        // become the layout bound.
        let node = null
        let rect = null
        for (const candidate of document.querySelectorAll('[data-composer-card]')) {
          const box = candidate.getBoundingClientRect()
          if (box.width < 80 || box.height < 20) continue
          if (box.right <= canvasRect.left || box.left >= canvasRect.right) continue
          if (rect === null || box.width > rect.width) {
            node = candidate
            rect = box
          }
        }
        if (node !== composerNode) {
          composerObserver.disconnect()
          composerNode = node
          if (node !== null) composerObserver.observe(node)
        }
        if (node === null || rect === null) {
          composerLeft = 0
          composerWidth = 0
          composerTop = 0
          return
        }
        composerLeft = rect.left - canvasRect.left
        composerWidth = rect.width
        composerTop = rect.top - canvasRect.top
      }

      /** Last canvas box in viewport coordinates, for pointer hit-testing. */
      let boxLeft = 0
      let boxTop = 0
      let boxWidth = 0
      let boxHeight = 0
      /** Pointer position in canvas coordinates; inactive while outside. */
      let pointerX = -1e6
      let pointerY = -1e6
      let pointerActive = false
      const onPointerMove = (event) => {
        pointerX = event.clientX - boxLeft
        pointerY = event.clientY - boxTop
        pointerActive = pointerX >= 0 && pointerY >= 0 && pointerX <= boxWidth && pointerY <= boxHeight
        if (pointerActive) {
          trail.push({ x: pointerX, y: pointerY, at: performance.now() })
          if (trail.length > 8) trail.shift()
        }
        if (reduced) paint(performance.now())
      }
      const onPointerLeave = () => { pointerActive = false }
      /** Recent pointer samples so the light leaves a short, fading trail. */
      const trail = []
      /** Click ripples: origin plus start time, oldest first. */
      const ripples = []
      const onPointerDown = (event) => {
        const x = event.clientX - boxLeft
        const y = event.clientY - boxTop
        if (x < 0 || y < 0 || x > boxWidth || y > boxHeight) return
        ripples.push({ x, y, at: performance.now() })
        if (ripples.length > 5) ripples.shift()
      }


      const measure = () => {
        const rect = canvas.getBoundingClientRect()
        dpr = Math.min(window.devicePixelRatio || 1, 2)
        width = Math.max(1, rect.width)
        height = Math.max(1, rect.height)
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        boxLeft = rect.left
        boxTop = rect.top
        boxWidth = width
        boxHeight = height
        readComposer()
      }

      /**
       * Draw one frame: both groups hold still and only their alpha breathes.
       * @param now - frame timestamp.
       */
      const paint = (now) => {
        if (disposed) return
        // The assembly is a short, fast reveal: give it a smoother frame rate
        // than the slow twinkle, then fall back to the cheap cadence.
        const assembling = now - started < ASSEMBLY_MS + 80
        const interval = (assembling ? 1000 / 60 : FRAME_MS) - 1
        if (!reduced && now - drawnAt < interval) {
          frame = requestAnimationFrame(paint)
          return
        }
        drawnAt = now
        const time = reduced ? 0 : (now - started) / 1000
        const dark = document.body.hasAttribute('data-ds-dark-theme')
        const ink = dark ? '236, 238, 242' : '102, 108, 120'
        // The composer card is the layout's bound: the pair is centred on it and
        // can never be wider than the input box.
        const limit = composerWidth > 160 ? composerWidth : width * 0.94
        const originX = composerWidth > 160 ? composerLeft : (width - limit) / 2

        // One pitch drives both groups: the wordmark and the portrait always share
        // the same dot size, and that pitch scales with the space available. Two
        // hard bounds: the composer width (the pair never exceeds the input box)
        // and the space above the composer (the pair hangs above it instead of
        // being covered by it).
        const availW = limit * 0.94
        const pairCells = LOCKUP_COLUMNS + GIRL_COLUMNS - 30
        const bandTop = composerTop > 140 ? composerTop : height * 0.86
        const heightPitch = Math.max(1, bandTop - 8) / GIRL_ROWS
        let pitch = Math.min(DOT_PITCH, availW / pairCells, heightPitch)
        let showText = true
        if (pitch < TEXT_MIN_PITCH) {
          // Only when the type would fall below the readable floor: drop the
          // wordmark and keep the portrait as large as it can be.
          showText = false
          pitch = Math.min(DOT_PITCH, availW / GIRL_COLUMNS, heightPitch)
        }
        if (pitch < 2.2) {
          context.setTransform(dpr, 0, 0, dpr, 0, 0)
          context.clearRect(0, 0, width, height)
          return
        }
        const blockW = LOCKUP_COLUMNS * pitch
        const blockH = LOCKUP_ROWS * pitch
        const portraitW = GIRL_COLUMNS * pitch
        const portraitH = GIRL_ROWS * pitch
        const overlap = Math.max(8, pitch * 30)
        const pairW = blockW + portraitW - overlap

        // Hang the pair off the composer: the portrait's bottom edge sits on the
        // composer's top edge, and the dot pitch above guaranteed it fits there.
        const portraitY = Math.min(
          Math.max(bandTop - portraitH / 2, 6 + portraitH / 2),
          Math.max(6 + portraitH / 2, height - portraitH / 2 - 6),
        )
        let portraitX
        let blockX = 0
        if (showText) {
          blockX = originX + Math.max(0, (limit - pairW) / 2)
          portraitX = blockX + blockW - overlap + portraitW / 2
        } else {
          portraitX = originX + limit / 2
        }
        // Keep the pair inside the canvas even if the composer rect was odd.
        const minX = portraitW / 2 + 6
        const maxX = Math.max(minX, width - portraitW / 2 - 6)
        portraitX = Math.min(Math.max(portraitX, minX), maxX)
        const blockY = portraitY - blockH / 2
        const portraitRadius = Math.max(0.8, pitch * 0.28)
        const lockupRadius = Math.max(0.8, pitch * 0.34)

        // The portrait runs one opacity notch brighter than the wordmark, so the
        // two groups keep separate alpha ladders.
        const portraitPaths = []
        const wordmarkPaths = [[], []]
        for (let level = 0; level < LEVELS; level += 1) {
          portraitPaths.push(new Path2D())
          wordmarkPaths[0].push(new Path2D())
          wordmarkPaths[1].push(new Path2D())
        }

        // Wordmark assembly: dots light up left to right, with a bright front.
        const assembly = reduced ? 1 : Math.min(1, (now - started) / ASSEMBLY_MS)
        while (ripples.length > 0 && now - ripples[0].at > 760) ripples.shift()
        const trailNow = trail.filter(sample => now - sample.at < 420)
        const rippleBoost = (x, y) => {
          let best = 0
          for (const ripple of ripples) {
            const age = (now - ripple.at) / 760
            const radius = age * 640
            const dx = x - ripple.x
            const dy = y - ripple.y
            if (dx * dx + dy * dy > (radius + 200) * (radius + 200)) continue
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (Math.abs(distance - radius) > 160) continue
            const band = Math.exp(-Math.pow((distance - radius) / 44, 2))
            best = Math.max(best, band * (1 - age))
          }
          return 1 + 1.25 * best
        }
        const trailBoost = (x, y) => {
          let best = 0
          for (const sample of trailNow) {
            const age = Math.max(0, (now - sample.at) / 420)
            const dx = x - sample.x
            const dy = y - sample.y
            if (Math.abs(dx) > 260 || Math.abs(dy) > 260) continue
            best = Math.max(best, Math.exp(-(dx * dx + dy * dy) / (2 * 95 * 95)) * (1 - age))
          }
          return 1 + 0.95 * best
        }
        const place = (target, dot, x, y, radius, kind, line) => {
          // The portrait holds a steady level; only the wordmark breathes.
          const breathe = reduced ? 0.6 : 0.5 + 0.5 * Math.sin(time * dot.speed + dot.phase)
          let tone = kind === 'portrait' ? dot.a : dot.a * (0.35 + 0.65 * breathe)
          if (kind === 'wordmark') {
            if (assembly < 1) {
              // Whole-word fade: the line rises as one piece, no left-to-right sweep.
              const offset = line === 1 ? ASSEMBLY_SECOND_LINE : 0
              const progress = Math.max(0, Math.min(1, (assembly - offset) / ASSEMBLY_LINE_SPAN))
              const smooth = progress * progress * (3 - 2 * progress)
              if (smooth <= 0.02) return
              tone *= smooth
            }
            if (pointerActive) tone *= trailBoost(x, y)
          }
          // Ripples are a wordmark effect; the portrait stays untouched.
          if (kind === 'wordmark') tone = Math.min(1, tone * rippleBoost(x, y))
          const level = Math.min(LEVELS - 1, Math.max(0, Math.round(tone * (LEVELS - 1))))
          // Halftone weighting: heavier cells draw slightly larger dots, so the
          // field reads as printed ink rather than a uniform grid.
          const size = radius * (0.82 + 0.36 * dot.a)
          target[level].moveTo(x + size, y)
          target[level].arc(x, y, size, 0, TAU)
        }
        const portrait = dark ? portraitDark : portraitLight
        for (const dot of portrait) {
          place(
            portraitPaths,
            dot,
            portraitX + (dot.u - 0.5) * portraitW,
            portraitY + (dot.v - 0.5) * portraitH,
            portraitRadius,
            'portrait',
          )
        }
        if (showText) {
          wordmark.forEach((dots, index) => {
            for (const dot of dots) {
              place(
                wordmarkPaths[index],
                dot,
                blockX + dot.u * blockW,
                blockY + dot.v * blockH,
                lockupRadius,
                'wordmark',
                index,
              )
            }
          })
        }

        context.setTransform(dpr, 0, 0, dpr, 0, 0)
        context.clearRect(0, 0, width, height)
        const paintGroup = (paths, boost, color) => {
          for (let level = 0; level < LEVELS; level += 1) {
            const alpha = Math.min(1, (0.05 + (level / (LEVELS - 1)) * 0.5) * boost).toFixed(3)
            context.fillStyle = `rgba(${color}, ${alpha})`
            context.fill(paths[level])
          }
        }
        // The portrait's opacity nudge flips with the palette: +10% on the light
        // canvas, and its inverse trim on the dark one, where light dots already
        // read brighter against the canvas.
        paintGroup(portraitPaths, dark ? 1.15 : 1.5, ink)
        if (showText) {
          paintGroup(wordmarkPaths[0], 1, ink)
          paintGroup(wordmarkPaths[1], 1, '122, 170, 255')
        }
        if (DEBUG) {
          context.fillStyle = '#ff5555'
          context.font = '12px monospace'
          const readout = [
            'pitch=' + pitch.toFixed(2) + ' limit=' + limit.toFixed(0) + ' composerTop=' + composerTop.toFixed(0),
            'canvas=' + width.toFixed(0) + 'x' + height.toFixed(0) + ' dpr=' + dpr + ' showText=' + showText,
            'portrait=' + portraitW.toFixed(0) + 'x' + portraitH.toFixed(0)
              + ' @ ' + portraitX.toFixed(0) + ',' + portraitY.toFixed(0),
            'block=' + blockW.toFixed(0) + 'x' + blockH.toFixed(0)
              + ' @ ' + blockX.toFixed(0) + ',' + blockY.toFixed(0),
          ]
          readout.forEach((line, index) => context.fillText(line, 12, 20 + index * 16))
          context.strokeStyle = '#ff5555'
          context.strokeRect(portraitX - portraitW / 2, portraitY - portraitH / 2, portraitW, portraitH)
          context.strokeStyle = '#5599ff'
          context.strokeRect(blockX, blockY, blockW, blockH)
        }
        if (!reduced) frame = requestAnimationFrame(paint)
      }

      const observer = new ResizeObserver(() => {
        measure()
        if (reduced) paint(performance.now())
      })
      observer.observe(canvas)
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('pointerleave', onPointerLeave, { passive: true })
      window.addEventListener('pointerdown', onPointerDown, { passive: true })
      measure()
      frame = requestAnimationFrame(paint)

      return () => {
        disposed = true
        cancelAnimationFrame(frame)
        observer.disconnect()
        composerObserver.disconnect()
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerleave', onPointerLeave)
        window.removeEventListener('pointerdown', onPointerDown)
      }
    }

    /**
     * Frame layer for the blank home: paint the dot mascot below the content and
     * pass the wrapped scroll body through untouched.
     * @param props - the home flag and the wrapped Conversation body.
     * @returns the layout-neutral frame.
     */
    function HeroFrame({ hero, children }) {
      const canvasRef = React.useRef(null)
      React.useEffect(() => {
        const canvas = canvasRef.current
        if (hero !== true || canvas === null) return undefined
        return attachMascot(canvas)
      }, [hero])
      return h('div', { className: 'dwe-frame' },
        hero === true ? h('div', { key: 'sign', className: 'dwe-sign' }, 'deepclear-ui') : null,
        hero === true ? h('canvas', { key: 'mascot', ref: canvasRef, className: 'dwe-whale', 'aria-hidden': 'true' }) : null,
        children)
    }

