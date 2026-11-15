# Design rules

Conventions that every future UI addition in this plugin follows. They exist because earlier
attempts drifted and had to be rebuilt; treat this file as binding.

## The toggle (`DcSwitchSvg`)

**Never build a switch out of CSS radii.** CSS `border-radius: 50%` is only a circle while the
element keeps a square box; a host rule, a zoom or a stretch turns it into a rounded square.
The switch is therefore **drawn as SVG geometry**, where the shapes are exact by construction.

```jsx
<svg width="42" height="24" viewBox="0 0 42 24">
  <rect x="0.5" y="0.5" width="41" height="23" rx="11.5" ry="11.5"
        style={{
          fill: on ? 'color-mix(in srgb, var(--dsw-alias-label-primary) 94%, transparent)'
                   : 'color-mix(in srgb, var(--dsw-alias-label-tertiary) 44%, transparent)',
          stroke: on ? 'color-mix(in srgb, var(--dsw-alias-label-primary) 94%, transparent)' : 'none',
          strokeWidth: 1,
          transition: 'fill 200ms cubic-bezier(0.22, 1, 0.36, 1), stroke 200ms cubic-bezier(0.22, 1, 0.36, 1)',
        }} />
  <g style={{
       transform: on ? 'translateX(18px)' : 'translateX(0px)',
       transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)' }}>
    <circle cx="12" cy="12" r="9"
            style={{
              fill: on ? 'var(--dsw-alias-bg-base, #17171a)'
                       : 'color-mix(in srgb, var(--dsw-alias-label-primary) 82%, transparent)',
              transition: 'fill 200ms cubic-bezier(0.22, 1, 0.36, 1)',
            }} />
  </g>
</svg>
```

| Property | Value | Why |
|---|---|---|
| Track | 42 × 24, `rx = ry = 11.5` | corner radius is half the height, so both ends are exact semicircles (a capsule / pill) |
| Knob | `<circle r="9">` | an 18px **perfect circle**, never a rounded square |
| Knob inset | 3px top/bottom, 3px left/right when off | `(24 − 18) / 2` |
| Knob travel | `translateX(18px)` | `42 − 3 − 18 − ... ` keeps the same 3px margin when on |
| On track | `label-primary` at 94% | bright filled capsule |
| On knob | `bg-base` | the knob takes the page colour, so the switch inverts |
| Off track | `label-tertiary` at 44% | dim capsule |
| Off knob | `label-primary` at 82% | light knob on the dim track |
| Outline | stroke 1px **only when on** | off stays borderless on purpose |
| Motion | fill/stroke 200ms, transform 220ms, `cubic-bezier(0.22, 1, 0.36, 1)` | gentle ease-out, no bounce |
| Focus | `outline: 2px solid var(--dsw-focus-ring-color)` with `outline-offset: 2px` | keyboard reachable |
| Accessibility | `<button role="switch" aria-checked>` with a real label | never a bare visual |

Both states must read at the same size: the same geometry is used in both, the bright track is
held at 94% and the dim track at 44% so the light-on-dark illusion does not make one look
fatter.

## Hover dot field

Every button in the sidebar carries a dot field that is **completely unlit at rest**. Dots
only surface inside a soft pool around the pointer, clipped to the hovered control, and fade
out when the pointer leaves. Dots never move.

Two implementations, one look:

| Where | How | Reach |
|---|---|---|
| DeepClear footer button | canvas inside the button (`overflow: hidden`), dots **behind** the icon and label, drawn only on `pointerenter` / `pointermove` | 64px |
| Every other sidebar control | one fixed overlay canvas (`shell.overlay`, `pointer-events: none`) that tracks the pointer, finds the control under it and prints dots clipped to that control's rounded rect | 74px |

Shared spec:

- Grid: pitch **4px**, dot radius **0.85px**, offsets aligned to the viewport grid (`floor(x / 4) * 4 + 2`)
- Brightness: `pow(1 - d / reach, 1.35)` — centre full, edge zero, soft tail
- Overlay alpha cap: **0.72** (the overlay prints over host text, so it stays light); the footer
  button has no cap because its dots sit behind the text
- Colour: `--dc-accent`
- Fade: `alpha += (target - alpha) * 0.22` per frame; the rAF loop stops when the pointer
  rests, on leave once alpha reaches 0, and collapses to a single frame under
  `prefers-reduced-motion`
- Scope: the sidebar is the lowest ancestor of `.dc-foot-button` that contains the hovered
  row (depth capped at 8), so chat columns and portalled sheets never light up
- `.dc-foot-button` is excluded from the overlay field (it draws its own)

Never inject nodes into host controls to achieve this.

## Other rules

## The thinking row

The host owns the row and the clock; we never replace the node. Only its **text** is
hidden (`opacity: 0`, so layout and the elapsed clock stay intact) and redrawn on the
overlay canvas:

- **Sphere**: 42 Fibonacci points on our own `position: fixed` canvas, 24px box, spinning
  at `now / 1800`, depth mapped to alpha and dot size, seated where the host icon sits
  (the icon is hidden while the sphere is on)
- **Label**: `Deep thinking for {seconds}s. . .` in the host row's own font, with the real
  elapsed seconds parsed out of the hidden host text, plus a whale-blue highlight band
  sweeping across every 2.6s
- **Never paint over the composer**: rows whose bottom edge would cross the composer card
  are skipped, so the sphere and label cannot bleed onto the input surface
- **Both switches off** hands the row back untouched: host text, host clock, host icon

## Other rules

## General rules learned so far

- **Dot lattice is a fixed grid**: dots never move; only their brightness changes. Animation is
  a property of the light, not of the geometry.
- **One lattice for the whole scene**: the background field, the wordmark and the portrait share
  the same pitch and phase, so every dot lands on its own cell.
- **Dark theme prints the portrait from the line-art grid** (`girl-lines.txt`), light theme from
  the ink grid (`girl-grid.txt`).
- **No host DOM writing**: only CSS markers, our own canvases, slot registrations and a single
  `html` class list for feature flags. The one exception is the settings sheet portal.
- **Chrome lives on theme tokens** (`--dsw-alias-*`); literal colours are reserved for artwork.
- **Anything that can throw at render must be caught**: a throwing slot component blanks its
  cell, and a throw during `apply` takes the whole plugin down.
