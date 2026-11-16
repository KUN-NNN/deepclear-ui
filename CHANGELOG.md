# Changelog

## 1.3.1

Consolidates everything shipped since 1.2.0. The intermediate 1.3.0–1.9.4 versions were
published to the registry while iterating and have been removed; 1.3.1 is the current line.

### Welcome page

- Mascot portrait sampled into a halftone grid on the right, `deepseek` / `harness`
  dot-matrix wordmark on the left, both on one lattice with the background field
- Entrance: wordmark fades as a whole (~1.3 s, `deepseek` first), portrait grows downward as
  a soft wipe (~1.1 s)
- A slow brightness wave travels across the lattice at the bottom; pointer movement sends
  light rings across the field; clicking ripples the wordmark
- Dark theme prints the portrait from the line-art grid, light theme from the ink grid

### Startup

- Splash: dark stage, dot field surfacing, ring travelling outward, `deepseek` (white) and
  `harness` (whale blue) rising in, a light sheen crossing the mark. `transform` / `opacity`
  only, so it stays smooth while the app boots
- Every launch opens a fresh blank conversation after the splash

### Thinking

- Overlay canvas draws a Fibonacci dot-sphere beside the live status, plus an English label
  (`Deep thinking for 12s. . .`) with a whale-blue highlight sweep; the real elapsed seconds
  come from the host clock
- The overlay is clipped above the composer and never paints over it; both parts fall back to
  the host row when their switch is off
- Sphere and label both carry a soft halo

### Composer

- Reasoning effort badge: any level except OFF unfolds a dot field in the send row and prints
  the level name in dots — `MAX` in whale blue with a halo, the rest white. Vertical highlights
  travel outward from the middle while the model thinks. Implemented purely in CSS: the plugin
  only stamps attributes on the composer card
- Caret trail: a fading column of dots follows the caret, filled to the full caret height,
  clipped to the card, IME composition included
- Frosted glass card (54% surface, 26px blur, sheen) on both the session and welcome pages
- Focus ring: neutral light grey with a soft halo
- A preference turns the effort badge on or off

### Sidebar

- Hover dot field around the pointer inside every sidebar button, plus a whale-blue rail on
  its left edge — both switchable in the settings sheet
- `DeepClear UI` footer button opens a floating settings sheet with one switch per feature
- Selected conversation is a deep grey plate
- Brand area (whale mark and product name) carries a quiet halo

### Chat

- Whale-blue bold prose with a soft halo
- User message bubbles get a whale-blue ring with two halos
- Re-inked diffs: additions in whale blue, deletions in deep blue, gutters and markers in the
  same family

### Preferences

- Stored in the profile config form, applied instantly and remembered across sessions;
  legacy client-side preferences migrate once, filtered to keys the schema still owns
- Says what it is doing when a host rejects a write (usually: a restart is needed after an
  update)

## 1.2.0

- Folded the accent stylesheet into the bundle: bold prose, composer focus ring and re-inked
  diffs ship in one package

## 1.1.0

- English docs and repository metadata

## 1.0.0

- First release: dot-matrix welcome page
