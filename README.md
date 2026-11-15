# DeepClear UI

![DeepClear UI: the deepseek / harness dot-matrix wordmark on the left and the mascot portrait on the right](docs/preview.png)

A dot-matrix welcome page and whale-blue accents for the DeepSeek Harness (dsh) web UI.
One bundle, no dependencies, no host-side code — a patch row, a client half and locale
metadata.

## Welcome page

- **Right**: the mascot portrait, sampled from an illustration into a halftone dot grid
- **Left**: the `deepseek` / `harness` dot-matrix wordmark

The portrait and the wordmark share one dot pitch, scale with the window, sit on the
composer, and disappear once the session starts. The stock headline, brand mark and
pixel-whale canvas are hidden while the page is showing, and a faint `deepclear-ui`
signature sits in the corner.

**The lattice is the design.** The background field, the wordmark and the portrait all sit
on the same dot grid, phase-aligned to the artwork, so every dot in the scene lands on its
own cell. Dots never move; only their brightness changes.

- Entrance: the wordmark fades in as a whole (`deepseek` first, `harness` after, ~1.3 s),
  then the portrait grows downward as a soft wipe (~1.1 s)
- The bottom of the page carries a slow brightness wave that travels across the same
  lattice
- Moving the pointer over the bottom band sends light rings across the field — the dots
  themselves stay put
- Clicking anywhere sends a ripple across the wordmark

## Thinking indicator

While a turn runs, the live status row is redrawn on our own overlay canvas:

- a small Fibonacci-sphere of dots spins in front of the label
- the label reads `Deep thinking for 12s. . .` with a whale-blue highlight sweeping across it
- the overlay is clipped above the composer, so nothing ever bleeds over the input box

When the turn ends, the built-in summary row takes over again — nothing animates after the
work is done.

## Composer

- **Welcome page**: the card stays solid, so the dot sheet behind it never shows through
- **Session**: the card becomes translucent glass (`backdrop-filter`), and a floor of dots
  fades up from the bottom edge of the window
- **Stats**: context usage and token usage move from the strip below the card into the send
  button row, as compact tabular figures

## Accents

Whale blue is `#7AAAFF`, used in three places:

- **Bold prose** in chat messages turns whale blue and stays bold
- **Composer focus**: a soft whale-blue ring fades in under the card's own hairline
  (240 ms, eased), plus a slow brightness swell on the dot field around it
- **Diffs**: added lines take whale blue, deleted lines deep blue, with the code text,
  gutter and `+` / `-` markers collapsed into the same blue family

The rules ride public markers (`[data-slot="conversation.chat.flow"]`, `[data-composer-card]`,
`[data-diff-line]`, `[data-chat-running]`, `[data-composer-dock]`) and ui-theme's own tokens;
if upstream renames one, that rule simply stops applying — nothing breaks.

## Install

```
npm i deepclear-ui
```

Or install it by name from the dsh Plugins panel.

## Customize

Swapping the artwork, painting a mask, or editing the dot grid directly is documented in
[`scripts/README.md`](scripts/README.md):

```
scripts\rebuild.cmd    # sample artwork -> splice the hero block -> inject the grids
scripts\preview.cmd    # render a preview strip of both themes
```

The dark theme prints the portrait from a **line-art grid** (`girl-lines.txt`) and the light
theme from the **ink grid** (`girl-grid.txt`), so both palettes read the way they were
designed to.

## Palette

| Token | Value |
|---|---|
| Whale blue | `#7AAAFF` |
| Dots, light theme | `#666C78` at per-cell alpha |
| Dots, dark theme | `#ECEEF2`, weight inverted |

Tested against dsh `0.2.2-rc.3`.

## License

MIT. See [LICENSE](LICENSE).
