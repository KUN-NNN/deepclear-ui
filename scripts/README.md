# 自己动手改点阵

这个目录是「鲸鱼娘 + 字标」点阵的生成流水线。改图、改遮罩、改网格都在这里，改完跑一条命令即可。

## 最快的路径：画一张遮罩

1. 把 `src-girl-mask.example.png` 复制成 `src-girl-mask.png`
2. 用任意画图工具打开，**在要去掉的地方涂白色**（黑 = 保留；图片尺寸不必和原图一样，会自动缩放）
3. 跑：

```
scripts\rebuild.cmd
```

4. 回到 dsh 窗口按 `Ctrl+R` 刷新

如果 `src-girl-mask.png` 存在，它就会**覆盖**内置的自动颜色遮罩（那个遮罩专门抠头顶的蓝色发丝环）。

## 只想换图

把新的立绘覆盖为 `scripts/src-girl.png`（建议上半身、白底），然后同样跑 `scripts\rebuild.cmd`。
网格列数在 `build_girl.py` 顶部：`COLUMNS = 104`（越大越细，点越多）。

## 预览（不用开 dsh）

```
scripts\preview.cmd        # 或者  python scripts\preview.py
```

输出 `scripts/preview-grid.png`：从左到右分别是「浅色主题网格 / 浅色主题反白 / 深色线稿网格 / 深色线稿反白」。

## 想直接改点阵（进阶）

`girl-grid.txt` 是 104×73 个十六进制字符，行优先：`0` = 空的格子，`1`–`f` = 点的浓度。
直接编辑它也能生效——改完只要跑

```
node scripts\splice.mjs
node scripts\build.mjs
```

（注意不要跑 `build_girl.py`，那会按图重新覆盖你的手改。）

## 参数都在哪

| 想调什么 | 文件 | 位置 |
|---|---|---|
| 采样精度（点密度） | `build_girl.py` | `COLUMNS` |
| 裁切比例（只留上半身） | `build_girl.py` | `CROP` |
| 自动抠发丝环的范围 | `build_girl.py` | `LOOP_BOX` / `LOOP_HUE` |
| 深色主题用的线稿强度 | `build_girl.py` | `LINE_GAIN` / `TONE_KEEP` |
| 点距、字号、布局、动画 | `hero.js` | `DOT_PITCH` / `LOCKUP_*` / `ASSEMBLY_*` |

`hero.js` 改完同样跑 `splice.mjs` + `build.mjs`（或直接 `rebuild.cmd`，它会重新采样，手改网格会丢）。
