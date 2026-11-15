# DeepClear UI：dsh 插件能力与设计地图

调查日期：2026-11-15。基线：本机 dsh **0.2.2-rc.3**、DeepClear UI **1.7.1**。

目标是让别人通过插件广场安装和使用 DeepClear。设计与实现优先走宿主公开接口，所有视觉增强都应可关闭、可撤销，并能与其他插件共存。

## 结论

DeepClear 可以从点阵首页发展成覆盖日常工作流程的完整主题：导航、阅读、输入、执行状态、代码与文件工作台都能设计。丰富度应来自这些场景之间一致的细节，而不是持续增加全屏动画。

本次从安装包只读提取了 79 个客户端及相关包，索引得到 **116 个 Slot、13 个 Factory**；主题 CSS 中找到 **477 个不同变量**。这些数字分别指静态 UI 合同和样式定义，不能理解为 129 个随时可用的位置或 477 个稳定公开 API。可选插件的入口要等其 owner 加载才存在。

本文主体记录 1.7.1 调查时的状态。随后已完成本地 1.8.0 首轮实现：深浅配色、阅读/代码、Host 设置与迁移、状态保真及卸载清理。验证范围见 [1.8 验证记录](VALIDATION-1.8.zh.md)。未修改宿主或真实用户 profile，也未发布。

## 依据与版本边界

- 首要依据：用户实际安装的 `DeepSeek Harness/resources/app.asar`，其中相关包版本为 `0.2.2-rc.3`。
- 补充依据：[公开仓库固定快照](https://github.com/deepseek-ai/deepseek-harness/tree/39163dd30f703a79079e2d2446545cff3c453738)。静态 UI primitives 另取 npm 同版本源码，避免把共享库未单独装入 asar 误判为功能缺失。
- 本机与该上游快照的 chat slot 名称一致；文件差异仅为类型导入路径。layout 的差异为 presenter 启动调用，不能据此宣称多出了布局插槽。
- 上游另有 `conversation.input.model.pane`，**本机版本没有**；`conversation.input.model.options` 的 owner 类型也变为具名合同。模型菜单扩展不能直接照新版实现。
- 上游把部分会话状态能力拆到了 `ui-session-status`；本机的 `useSessionStatus` 仍由 `ui-session` 提供。依赖声明必须按目标版本适配。
- 调查时 1.7.1 的 `engines.dsh: >=0.2.1-rc.5 <0.3.0` 未经过完整测试；1.8.0 已将最低版本收紧为 `0.2.2-rc.3`，并在该安装版本完成独立 web profile 验证。

本地完整源码快照、文件哈希、Slot/Factory 类型、CSS 变量索引和检查报告保存在宣传片资源目录：`DeepClear-Promo/02-assets/dsh-plugin-audit/`。其中 `SURFACE-INDEX.zh.md` 与 `surface-index.json` 可用于后续查证。快照属于开发参考，不需要随主题分发。

## 扩展方式如何选择

| 方式 | 适合做什么 | 需要承担的责任 |
|---|---|---|
| ThemeRuntime token 覆盖 | 全局配色、表面、边框、代码与差异颜色 | 每个 token 提供 light/dark；用 disposer 撤销自己的层 |
| list Slot，新 id | 添加按钮、小信息、装饰、设置入口 | 保留其他贡献；控制尺寸、顺序和事件区域 |
| hoc Slot | 包裹首页或已有内容 | `children` 至多渲染一次；不丢原有行为 |
| keyed / single Slot | 替换一个明确组件或某类渲染器 | 保留该组件承担的交互、数据和无障碍语义 |
| chain Slot | 对符合 selector 的状态接管 | selector 保持纯函数；未匹配时让宿主继续处理 |
| 语义 DOM marker + CSS | 微调间距、文字、局部材质 | marker 仍需版本检查；失配时优先回退宿主显示 |
| CSS Modules 类名子串、全局 DOM 测量 | 公开接口尚未覆盖的局部增强 | 高维护成本，隔离适配，避免作为核心必需功能 |

SlotMap 的类型声明不等于运行中的插槽。用 `ctx.slots.inject(name, ...)` 跟随 owner 的声明生命周期。注册到 `root` 会接管整棵应用树；替换 `sidebar`、`rightbar` 等占位，也可能撤下原占位者声明的子入口。主题不应靠这些位置进行普通装饰。

Factory 是可复用的内容组件。它可以帮助保留宿主的文本或图片渲染能力，不代表它会自动包裹所有现有组件。

参考：[Slots](https://github.com/deepseek-ai/deepseek-harness/blob/39163dd30f703a79079e2d2446545cff3c453738/packages/client/ui-slots/README.zh.md)、[Renderer root 合同](https://github.com/deepseek-ai/deepseek-harness/blob/39163dd30f703a79079e2d2446545cff3c453738/packages/client/ui-renderer/src/client/registry.ts) 。

## 能设计的界面范围

表中列出主要入口；完整 116 个 Slot 和 13 个 Factory 见本地索引。入口可用性受其所属功能是否加载影响。

| 区域 | 能做的设计 | 主要公开入口 | DeepClear 推荐方式 |
|---|---|---|---|
| 全局颜色与材质 | 深浅背景、层级、文字、焦点、菜单、选中、阴影 | `ctx.theme.overrideTokens`，主题 CSS 变量 | 建立一套黑白灰基底和鲸鱼蓝强调；减少独立硬编码颜色 |
| 产品图标 | 替换主题 sprite 支持的操作图标 | `ThemeDefinition.icons`，`ICON_SYMBOLS` | 可做统一几何风格；先小范围验证，再扩展 |
| 新会话首页 | 点阵画作、品牌、工作区、预设、选项 | `conversation.hero.frame / brand.mark / workspace / agentPreset / options` | 保留现有固定网格，适配窄窗与空白会话 |
| 左栏品牌与全局导航 | 标记、名称、新会话装饰、自有页面入口 | `sidebar.brand.mark / name`、`sidebar.session.action`、`sidebar.panellist` + `main` 同名 key | 少量点阵识别；用明确入口承载自有页面 |
| 左栏会话与工作区 | 行旁小标记、悬浮卡片、自有菜单操作 | `sidebar.session.row.leading / trailing / hover`、`sidebar.workspaces.session.row.action / menu.item` | 小尺寸状态信息；已有运行、未读、待交互信息优先 |
| 会话顶部 | 实用按钮、谱系、角落控件、视图菜单 | `conversation.session.header.actions / utilities / lineage / corner / views.actions` | 对齐和层级统一；保持窗口拖拽区和窄窗可用 |
| 输入卡片 | 两侧工具、卡片上方、内部浮层、下方附加层 | `conversation.input.left / right / dock / overlay`、`conversation.composer.dock` | 专注输入，清楚展示上下文与可操作状态 |
| 输入选择控件 | 模型标签、额外模型选项、权限、计划、附件 | `conversation.input.model / permission / plan / attachments / activity`、`.model.label / options` | 优先装饰与补充；保留锁定、失败反馈和选择逻辑 |
| 整个输入区 | 自有 composer 或符合状态时接管 | `conversation.composer.bar`、`conversation.composer` chain | 第一轮避免重写；编辑器责任很大 |
| 正文与用户消息 | 字体、标题、行距、链接、引用、气泡层级 | theme 排版变量、语义 CSS marker、`conversation.chat.user.before`、`conversation.chat.node` | 先做阅读体验；整节点替换单独评估 |
| 代码与思考正文 | 代码配色、代码围栏外壳、思考正文呈现 | `--shiki-*`、`conversation.chat.markdown.fence`、`.reasoning.body`、`.reasoning.content` Factory | 保留复制、换行与原文访问，不强制把所有代码染蓝 |
| 回合结束 | 小结附加内容、助手操作 | `conversation.chat.turnTail`、`.assistant-actions` | 收束执行状态，按需显示；避免重复宿主操作 |
| 运行中指示 | 局部状态外观与自有辅助提示 | `data-chat-running`、会话状态 hooks | 本机没有独立 running renderer Slot；当前覆盖方式需适配与回退 |
| 工具执行卡片 | Bash、读写文件、搜索、网页、图片等卡片 | `tool.call.toolview` 按工具 wire name keyed；`tool.call.images` | 优先 token 与局部样式；自绘卡片须处理 preparing/start/result |
| 右侧工作台 | 自有 tab、tab 标题、引导页、菜单 | `sidebarRightTabs.register`、`sidebar.right.pane.tab / title`、`sidebar.right.tab.guide / guide.entry / guide.actions / menu.item` | 先统一表面与层级；只有明确用途才新增 tab |
| 文件与预览 | 文件树、预览工具栏、空状态、自有文档渲染器 | `sidebar.files.tree / navigator` Factories、`sidebar.right.tab.document / action / actions / unpreviewable`、`.files.actions` | 文件类型易辨认；保留授权加载、打开和缩放 |
| 终端 | 外壳、背景与前景、字号字体 | 主题变化 → 宿主 TerminalTheme；terminal 字体设置 | 复用宿主 xterm 与 shell，会话和输出不能因换主题重建 |
| 产物、计划与审批 | 卡片外观、审批详情、计划附加操作 | `deliverables.file.actions / review.file.actions`、`conversation.approval.detail`、`.plan-review.actions` | 风格统一，同时保留通过、拒绝、失败与等待状态 |
| 子会话、轨迹、Forge | 已有功能页面的样式、自有扩展 | `sidebar.chat.conversation`、`conversation.session.header.actions.subagent.footer`、`conversation.trajectory.images`；Forge 使用通用 Slot | 不能把实验功能当成所有用户默认已安装的依赖 |
| 设置与插件详情 | 正式主题配置页、导航图标、插件配置、重置 | `settings.section / section.icon / general.item`、`plugins.bundle.config / row.config` | 设置放到宿主体系，减少侧栏入口拥挤 |
| 菜单、通知、全局层 | 自有右键操作、提示、辅助浮层 | `ctx.contextMenus.register`、`contextMenu.icon / content`、`shell.overlay / bottom / quota-notice` | 浮层不挡输入，交互只占自己的区域；不长期霸占屏幕 |

相关合同：[Conversation](https://github.com/deepseek-ai/deepseek-harness/blob/39163dd30f703a79079e2d2446545cff3c453738/packages/client/ui-conversation/src/client/contract/slots.ts)、[Chat](https://github.com/deepseek-ai/deepseek-harness/blob/39163dd30f703a79079e2d2446545cff3c453738/packages/client/ui-chat/src/client/contract/slots.ts)、[Workspace](https://github.com/deepseek-ai/deepseek-harness/blob/39163dd30f703a79079e2d2446545cff3c453738/packages/client/ui-workspace/src/client/contract/slots.ts)、[Sidebar Right](https://github.com/deepseek-ai/deepseek-harness/blob/39163dd30f703a79079e2d2446545cff3c453738/packages/client/ui-sidebar-right/src/client/contract/slots.ts)、[Tool](https://github.com/deepseek-ai/deepseek-harness/blob/39163dd30f703a79079e2d2446545cff3c453738/packages/client/ui-tool/src/client/contract/slots.ts)。以上为补充参考，具体实现仍以本机快照为准。

## 配色、图标、设置的关键限制

### 配色应通过正式覆盖层

```js
// 设计示例；尚未写入 DeepClear 的运行代码。
// 这个子作用域等待 theme 服务，卸载时只释放自己的覆盖层。
ctx.inject(['theme'], scope => {
  scope.effect(() => scope.theme.overrideTokens('deepclear-ui', {
    '--dsw-alias-brand-primary': {
      light: '#336BC1',
      dark: '#7AAAFF',
    },
  }), 'deepclear-ui: palette')
})
```

覆盖层逐 token 合成，同 token 后注册的层胜出。同 source 再覆盖会替换旧层；旧 disposer 不会误删其新层。ThemePresenter 将最终 token 写到 `body.style`，单独在 `:root` 改同名变量可能无效。

可利用的变量包括 `--dsw-alias-bg-* / label-* / border-* / interactive-*`、`--dsw-specific-*`、`--dsw-alias-file-diff-*`、`--dsw-alias-code-diff-*`、`--shiki-*`、`--dsw-radius-*`、`--dsw-elevation-*`、`--ds-transition-*`。并非所有间距或组件几何都已 token 化；存在变量也不代表所有组件都会消费它。

字体设置应尊重宿主已经持久化的正文、代码、终端字体和字号。不要为了保持截图效果强行锁死用户字号。

### 图标可替换，但有确定范围

同版本 npm primitives 源码包含 102 个产品 glyph，每个有 regular/medium 两种权重，对应 204 个 symbol id，形式如 `dsw-icon-search-outline-regular`。`ThemeDefinition.icons` 只覆盖这组产品图标，文件类型、插件、站点、品牌图稿和原生应用图标不都在其中。

SVG 要有正确命名空间和 viewBox，不能含文档级 style/script，内部 id 必须加该 symbol 的前缀。图标替换属于注册主题定义；token override 层本身没有 icons 字段。仅注册定义不会切换主题，需要通过 `setTheme` 激活相应 id，替换图标才会生效。

内置设置只持久化 `light / dark / system`。第三方主题 id 是进程内扩展，注册后不会自动变成跨重启保存的主题选项。若引入自有预设或图标主题，需要自己设计持久化、深浅模式联动与卸载回退。

### 设置应归属明确

当前 localStorage 可以保存本浏览器偏好，但代码的固定 key 不足以保证按 dsh profile 隔离，也不保证跨窗口即时同步。README 中“per profile”的说法需要收紧。

正式方案是由插件 Host 半部声明 Config schema，并使用宿主 settings 支持；Client 经 `ctx.configForms.get('deepclear-ui')` 读取、订阅和提交。宿主 `ui-theme` 提供了 volatile 配置与 `settings.configure` 的同版本例子。还需设计旧 localStorage 的一次性迁移、不可写时提示和默认值恢复，不能只把现有对象改个存储位置。

主题开关可以复用同一份数据，在 `plugins.bundle.config`（key 为 `deepclear-ui`）中呈现；需要独立完整外观页时再考虑 `settings.section`。自有控件继续遵守 [DESIGN.md](DESIGN.md) 的 SVG 开关规则。

参考：[Theme](https://github.com/deepseek-ai/deepseek-harness/blob/39163dd30f703a79079e2d2446545cff3c453738/packages/client/ui-theme/README.zh.md)、[Settings](https://github.com/deepseek-ai/deepseek-harness/blob/39163dd30f703a79079e2d2446545cff3c453738/packages/client/ui-settings/README.zh.md)。

## 不应直接承诺的范围

- **运行状态的完整替换**：本机 RunningStatus 是 Chat 内部组件，没有独立公开 Slot。`data-chat-running` 可以识别外层，但 `_runningText`、`_runningIcon` 是内部类名，不是稳定合同。不能承诺所有宿主版本都能原样替换。
- **整套输入框与聊天流**：技术上有替换入口，但会承担 IME、选区、附件、发送、queue/steer、滚动跟随、分页、焦点、折叠等责任。高级感优先通过 token、装饰与内容层级实现。
- **终端任意字符颜色**：xterm 自己绘制内容，普通 CSS 不能替代其 ANSI/OSC 配色机制。宿主会保留程序自己的颜色覆盖。
- **浏览器内网页与独立文档**：可以设计应用工具栏和外壳，不能指望宿主 CSS 穿透跨域 iframe、Electron webview、PDF/Office 等独立呈现载体。
- **所有启动与原生界面**：客户端主题加载前的 boot、登录/错误状态、系统标题栏、文件对话框、安装器、更新器、系统图标等各有归属，普通客户端样式无法一并接管。
- **零首帧色差**：`immediately: true` 代表预取阶段，不是保证主题代码早于一切首帧。dsh 自带 boot 会先恢复内置配色与字体，自有主题需要另行验证加载时序。

## DeepClear 1.7.1 的分发前发现

以下问题记录用于下一轮实现，当前没有顺手改动运行代码。

| 发现 | 证据与影响 | 下一步 |
|---|---|---|
| diff 选择器无法匹配 | `client.js` 的 `:root:not(.dc-off-diff) html body` 要求根元素下面再有 html；独立 Edge 文档确认匹配数为 0 | 修正选择器，优先迁移到正式 token 层 |
| diff 开关不能完整恢复 | 深色 token 块及部分行文字规则未受开关控制；隔离检查中开关前后的文字和 token 相同 | 将 token、行样式和语法颜色的开关行为统一 |
| 卸载留全局状态 | 执行插件已注册 effect 的 disposer 后，style 已移除，`dc-off-*` 与 `window.__dcSettings` 仍存在；settings cleanup 当前为空 | 只清理插件拥有的 classes/global，检查 HMR 重入 |
| Stats 存在条件 hook 调用 | 同一组件开关两种路径分别调用 2 次和 0 次 `useProjection`；结构检查已确认，尚未复现真实 React 异常 | hooks 无条件调用，使用可订阅设置状态；不要依赖父级偶然重渲染 |
| 思考时钟不是宿主回合时钟 | 当前以 overlay 首次看到 DOM 行的时间开始计算 | 使用宿主已公开的回合时序数据或保留宿主耗时；避免显示成准确执行耗时 |
| 多会话覆盖不够精确 | busy 聚合所有会话，状态行和输入框则只取全局第一个匹配元素 | 绑定实际显示实例，覆盖多会话、子会话和嵌入场景 |
| 减少动效未覆盖所有动画 | overlay 仅 sonar 判断 reduced motion，sphere 仍按 time 旋转 | 静态状态也要完整表达；隐藏窗口/离屏时停绘并实测负载 |
| render 容错还需分层 | `guarded()` 包住注册调用，并不包住未来每次 React render；异步回调也不会被它自动捕获 | 为增强模块设计失败回退，尤其避免宿主文字已隐藏而增强层不可用 |

检查报告：本地 `deepclear-audit-checks.json`。验证在独立 headless Edge 的空白页面载入原始 client.js，使用 module/slot stub；未连接用户应用、未运行真实 React 树。因此 CSS 与 effect 清理的观察可直接复查，hooks 项仅证明调用结构不一致，不声称已复现整个应用崩溃。

另已执行 `npm pack --dry-run --ignore-scripts --json`：当前包清单 16 个文件，入口、patch、locale、图标、README 与预览图齐全，估算压缩后约 564 kB。没有生成 tarball 或运行打包生命周期脚本；这只验证分发文件清单，不能代替隔离 profile 的真实安装验收。报告为本地 `deepclear-pack-audit.json`。

## 适合继续做的设计

沿用现有识别，不扩成满屏赛博装饰。下一版建议按使用频率推进：

1. **阅读与代码**：先统一深浅灰阶、标题、段落、链接、行内代码、代码块和 diff。鲸鱼蓝用于重点；错误、警告、删除与新增仍要有明确差异，不能只靠颜色辨认。
2. **输入与执行**：清楚区分待输入、聚焦、运行、等待用户、结束。点阵承担少量局部反馈，减少全屏持续变化；数值不抖动、不挤发送按钮。
3. **会话与工作台**：导航选中、tab、文件树、预览工具栏、终端外壳采用同一密度与层级。用小型图形和留白建立品牌感。
4. **主题设置**：提供少量清楚的选项，例如标准/紧凑、动效正常/减少，以及现有艺术层开关。不要把每个 CSS 属性都变成设置。
5. **首页微调**：只补深浅与窄窗质量；固定位置、统一 pitch/phase、只变亮度的点阵规则继续有效。

动效参数先作为设计候选：悬停/按下约 100–160 ms，局部切换约 180–240 ms，较大面板约 240–320 ms，短距离、快速响应后平稳收住；用实际机器观察后定稿。流式正文、滚动和编辑不套通用入场动画。

推荐先交付的一轮是：**补齐开关和卸载行为 → 建立深浅 token 层 → 做正文、代码与输入区的一致性 → 最后扩展工作台。** 这会让首页之外的使用体验也有 DeepClear 的完整性。

## 分发与插件广场

当前工程已经有 npm 包、`./client` 出口、bundle patch、locale 和图标，具备插件包骨架。`index.js` 为空是当前纯客户端功能的选择；加入正式 settings 后需要相应 Host 声明。

交付前需要完成这些具体工作：

- **包内容**：核对 `files / exports / dsh.bundle.patch / dsh.client` 与实际产物，检查 npm pack 列表；不能假设用户会在安装后运行本地重建脚本。当前自包含 client.js 已存在，不需要为调查重采样画作。
- **客户端依赖**：保持 React 等共享运行时身份一致。以后引入 primitives 或其他静态运行时模块，核对该版本的 `dsh.client.external` 与包依赖；功能协作走 service/Slot，避免打包另一份宿主功能实现。
- **兼容范围**：明确测试过的 dsh 版本、Desktop/Web、深浅/system、缩放与窄窗；接口不可用时回退原界面，而不是因可选增强拒绝整个主题加载。
- **生命周期**：安装、首次启用、关闭、重新启用、重载、卸载，均释放自己的 token 层、style、Slot、portal、监听器、timer、observer 和 RAF；保存偏好是否保留另行明确。
- **共存**：与其他首页、主题、会话增强并用时检查单占位冲突、同 token 覆盖和 overlay 层级；不要通过删除其他插件 DOM 解决冲突。
- **展示材料**：提供版本一致的中英文介绍、深浅主题截图、安装说明与已知边界；相对图片必须实际打包并可被详情读取器加载。素材来源与分发许可也要核对。
- **广场收录**：发布包与进入索引是两步。所查 dsh market 从用户配置的索引读取，默认 indexes 为空；要进入用户使用的广场，需要按该索引的规则收录，不能把 npm 发布等同于自动展示。

市场可使用 npm 精确版本或 Git 固定 commit，版本元数据应与包的版本和 engines 相符。详情选择依次考虑 locale `meta.detail`、包 README、仓库 README；当前 locale 没有 detail，`docs/DETAIL.md` 不会仅凭文件名自动成为详情。

发布顺序建议为：本地可安装包验证 → 隔离 profile 安装验收 → 确定兼容范围与版本 → 准备截图及元数据 → 发布包 → 提交目标广场索引。此次调查没有执行发布或索引提交。

参考：[打包与发布](https://github.com/deepseek-ai/deepseek-harness/blob/39163dd30f703a79079e2d2446545cff3c453738/docs/user/develop/basic/publish.zh.md)、[Plugin Market](https://github.com/deepseek-ai/deepseek-harness/blob/39163dd30f703a79079e2d2446545cff3c453738/packages/boot/plugin-market/README.zh.md)、[Market Index](https://github.com/deepseek-ai/deepseek-harness/blob/39163dd30f703a79079e2d2446545cff3c453738/packages/util/plugin-market-index/README.zh.md)。
