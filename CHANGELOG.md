# Changelog

## 1.5.7

- Fix: the two Thinking switches read the wrong keys (`sphere` / `label` instead of
  `thinkingSphere` / `thinkingLabel`), so they always looked off and toggling them wrote a
  key no feature reads. Every switch is now audited against the settings defaults at build
  time.

## 1.5.6

- Settings switches: a 48x28 capsule track (radius exactly half the height) with a round
  knob inside, so the shape reads as a pill rather than a rounded rectangle
- The sidebar sheet corner radius grows from 14px to 20px

## 1.5.5

- Settings switches are capsules now: a wider track with a capsule-shaped knob sliding
  inside it.

## 1.5.4

- The settings sheet paints from the app's own surface tokens (`--dsw-alias-bg-base` under
  `--dsw-alias-bg-layer-1`) instead of hand-picked greys, which removes the blue cast and
  keeps it solid in both themes.

## 1.5.3

- The sidebar sheet is opaque: the shared menu surface token carries alpha, so it now paints
  a solid panel colour per theme instead of letting the dot field show through.

## 1.5.2

- Fix: the nine-dot icon component was lost while the settings page was rewritten for the
  sidebar sheet, so the sidebar button threw on render and vanished. Restored, and every
  registered component is now render-checked before release.

## 1.5.1

- Settings sheet copy follows the app language: Chinese when the UI is Chinese, English
  otherwise. The sheet is titled and announced accordingly.

## 1.5.0

- The settings page moved out of Settings and into the sidebar foot: a **DeepClear UI** button
  (nine-dot icon + label) opens a floating sheet with the same switches, portalled to the body
- `Esc` and a scrim click close the sheet; the old `settings.section` entry is gone

## 1.4.2

- Settings navigation: the section label is registered as a thunk (the shell resolves nav
  labels lazily; a plain string rendered an empty row) and the section now ships its own
  nine-dot nav icon.

## 1.4.1

- Fix: the settings registration was declared before the internal guard helper, so the client
  half threw during apply and the whole plugin (including the welcome-page artwork) failed to
  register. The registration now runs after the guard is defined.

## 1.4.0

### Settings

- New **Settings ▸ DeepClear UI** page: one switch per feature (welcome artwork, dot field,
  bottom wave, pointer ripples, thinking sphere, English label, dot floor, frosted glass,
  usage readout, whale-blue bold, focus ring, re-inked diffs)
- Preferences persist in `localStorage` and apply immediately — CSS features through a root
  class, canvas features through a live settings object
- "Reset to defaults" restores every switch

## 1.3.0

### Welcome page

- The background dot field, the wordmark and the portrait now share one lattice: the field is
  phase-aligned to the artwork, so every dot lands on its own cell
- A slow brightness wave travels across the bottom of the page on that same lattice
- Pointer movement over the bottom band emits light rings; the dots themselves never move
- Portrait entrance: a soft top-down wipe that starts 140 ms after the wordmark (~1.1 s)
- Wordmark entrance lengthened to 1.3 s (`deepseek` first, `harness` after)
- The reveal clock now starts on the first frame that has a real canvas, so the animation can
  no longer finish while the layer is still being laid out

### Thinking indicator

- Live status row: a rotating Fibonacci dot-sphere plus `Deep thinking for 12s. . .` with a
  blue highlight sweep, drawn on the plugin's own overlay canvas
- The overlay is clipped above the composer card, so the sphere and label never paint over
  the input box
- The built-in label is hidden visually (layout and screen-reader text kept)

### Composer

- Session pages: frosted glass card (`backdrop-filter`) and a dot floor fading up from the
  bottom of the window
- Welcome page: opaque card again, so the dot sheet cannot show through
- Context usage and token usage moved into the send-button row as compact tabular figures
  (the shipped stats strip below the card is hidden)
- Focus ring softened: 240 ms eased transition with a two-layer inset ring instead of an
  instantly recoloured hairline

### Fixes

- Removed the experimental chat-node takeover and all host-DOM writing; the plugin now only
  uses CSS markers, its own canvas overlay and slot registrations
- Dark-theme portrait uses the line-art grid, matching the app

## 1.2.0

- Folded the accent stylesheet into the bundle: bold prose, composer focus ring and re-inked
  diffs ship in one package

## 1.1.0

- English docs and repository metadata

## 1.0.0

- First release: dot-matrix welcome page
