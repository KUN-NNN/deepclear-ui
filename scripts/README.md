# Editing the dots

Everything that turns the artwork into the dotted welcome page lives here. Change the art, paint
a mask, or edit the grid, then run one command.

## Fastest path: paint a mask

1. Copy `src-girl-mask.example.png` to `src-girl-mask.png`
2. Open it in any paint app and **paint white over what should disappear** (black = keep; the
   canvas does not have to match the source size, it is scaled automatically)
3. Run:

```
scripts\rebuild.cmd
```

4. Refresh the dsh window with `Ctrl+R`

When `src-girl-mask.png` exists it **overrides** the built-in colour mask that lifts the blue hair
loop above the head.

## Swap the artwork

Replace `scripts/src-girl1.png` with a new illustration (upper body on a plain background works
best), then run `scripts\rebuild.cmd`.

The grid width lives at the top of `build_girl.py`: `COLUMNS = 104` (higher = finer dots).

## Preview without opening dsh

```
scripts\preview.cmd
```

Writes `scripts/preview-grid.png`: four panels, left to right —
ink grid on the light canvas, its inverse, line-art grid on the dark canvas, its inverse.

## Edit the grid directly (advanced)

`girl-grid.txt` holds 104 x 73 hexadecimal characters, row by row: `0` is an empty cell and
`1`-`f` is the dot weight. Editing it works, but then only run:

```
node scripts\splice.mjs
node scripts\build.mjs
```

Do **not** run `build_girl.py` after a manual edit — it re-samples the artwork and overwrites the file.

## Where the parameters are

| What to tune | File | Name |
|---|---|---|
| Grid resolution (dot density) | `build_girl.py` | `COLUMNS` |
| How much of the artwork is kept | `build_girl.py` | `CROP` |
| Automatic hair-loop mask | `build_girl.py` | `LOOP_BOX` / `LOOP_HUE` |
| Line-art strength (dark theme) | `build_girl.py` | `LINE_GAIN` / `TONE_KEEP` |
| Dot pitch, layout, animation | `hero.js` | `DOT_PITCH` / `LOCKUP_*` / `ASSEMBLY_*` |

Changing `hero.js` needs `splice.mjs` plus `build.mjs` afterwards (or just `rebuild.cmd` — but that
re-samples the artwork, so manual grid edits are lost).
