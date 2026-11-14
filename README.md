# DeepClear UI

新会话欢迎页的点阵鲸鱼娘和 dsh 字样装饰。

- 右侧：鲸鱼娘点阵人像
- 左侧：`deepseek` / `harness` 点阵字标

## 交互

- 进入欢迎页时字标整体渐显（`deepseek` 先、`harness` 后）
- 鼠标划过字标会提亮并留短尾迹；点击会扩散一圈涟漪

## 自定义

改图、改点阵、改遮罩的流程见 [`scripts/README.md`](scripts/README.md)：

```
scripts\rebuild.cmd    # 采样 → 拼接 → 注入
scripts\preview.cmd    # 生成预览图
```

Tested against dsh `0.2.2-rc.3`.
