# Changelog

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
