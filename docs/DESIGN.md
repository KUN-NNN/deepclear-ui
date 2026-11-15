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
