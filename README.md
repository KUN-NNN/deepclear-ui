# DeepClear UI

![DeepClear UI: the deepseek / harness dot-matrix wordmark on the left and the mascot portrait on the right](docs/preview.png)

A dot-matrix welcome page for the DeepSeek Harness (dsh) web UI.

- **Right**: the mascot portrait, sampled from an illustration into a halftone dot grid
- **Left**: the `deepseek` / `harness` dot-matrix wordmark

Both groups share one dot pitch, scale with the window, sit on the composer, and disappear
once the session starts. The stock headline, brand mark and pixel-whale canvas are hidden.

## Interactions

- The wordmark fades in as a whole when the welcome page appears: `deepseek` first, `harness` after
- Hovering the wordmark lights the dots up and leaves a short trail
- Clicking anywhere in the page sends a ripple across the dot field

## Install

```
npm i deepclear-ui
```

Or install it by name from the dsh Plugins panel. The bundle ships a patch row, a client
half and locale metadata; no host-side code runs.

## Customize

Swapping the artwork, painting a mask, or editing the dot grid directly is documented in
[`scripts/README.md`](scripts/README.md):

```
scripts\rebuild.cmd    # sample artwork -> splice the hero block -> inject the grids
scripts\preview.cmd    # render a preview strip of both themes
```

## Palette

| Token | Value |
|---|---|
| Whale blue (`harness`) | `#7AAAFF` |
| Dots, light theme | `#666C78` at per-cell alpha |
| Dots, dark theme | `#ECEEF2`, weight inverted |

Tested against dsh `0.2.2-rc.3`.
