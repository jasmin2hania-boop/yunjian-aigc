# 云间来信 · Hania 的 AIGC 编导知识库

雾紫云朵、奶油信笺、裸粉衬纸。首页是唯一总入口；Markdown 是内容的唯一来源。联系方式只使用公开名 **Hania**，邮箱 `cnclh0420@163.com`；个人印章沿用确认的 **LH**。

网站地址：[云间来信](https://jasmin2hania-boop.github.io/yunjian-aigc/)。

## 启动与预览

需要 Node.js 20.19+ 和 pnpm 11.25.0。安装 Node 后执行：

```sh
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install
pnpm dev
```

浏览器打开终端显示的地址。若系统没有 Corepack，可按照 pnpm 官方安装说明安装对应版本，然后执行后两条命令。首次安装只允许 esbuild 的平台构建脚本，配置在 `pnpm-workspace.yaml`。

```sh
pnpm check     # 检查元数据、内部链接与图片
pnpm test      # 验证中文搜索、链接解析、星标和双向关联
pnpm build    # 将可发布的网站生成到 dist/
pnpm preview  # 在本地查看构建结果
```

## 分类目录与阅读顺序

网站始终保持三层：**首页九板块 → 分类笔记目录 → 独立笔记详情**。分类目录有自己的目录式布局，显示每篇的标题、简介、日期与标签，适合继续收录多组教程和多篇文章。添加笔记后，分类页自动增加对应入口。

当前三视频先读“合集教程”中的《三视频精读》，再按问题打开六篇主题：故事与分镜、视觉规则、人物资产、空间连续性、自然表演、制作与交付。原视频底稿完整保留；已整合的细分记录在目录中折叠，旧链接仍可打开。提示词分为基础用途和镜头案例，模板按制作阶段排列。

如需调整目录位置，可选填 `reading`（`main` 主线、`topic` 主题、`source` 来源、`detail` 细分记录）、`group`（目录小组名称）和 `order`（组内顺序数字）。普通新增笔记无需填写这些可选字段，也会正常进入分类目录。

## 电脑与手机的阅读布局

电脑上的分类目录是横向索引册：760px 起使用两列纸签，1200px 起使用三列；阅读主线独占一行。每张纸签仍对应一篇独立 Markdown，标签有单独的点击入口。

1100px 起，文章展开成主信纸与右侧旁注。旁注自动读取文章标题生成提纲，读取已有链接提取最多三篇合集底稿，并显示本篇标签与来源；随正文自然滚动，不固定在屏幕上。正文保持阅读宽度，外侧用衬纸、信封、纸纹、柔光和 LH 压印形成桌面层次。窄屏恢复单列信件，提纲在标题下折叠，来源仍在文末。

样式集中在 `docs/.vitepress/theme/editorial.css`；旁注组件为 `ReadingMargin.vue`。纸角悬停、卡片微抬与标题下划线、提纲定位高亮、复制盖章均支持减少动态效果的系统设置。首页与三级页面关系保持原样。

## 平时怎样新增笔记

最快的方法是复制 `templates/note.md` 到对应目录，改文件名和 frontmatter，然后写 Markdown。合集底稿使用 `templates/collection.md`。也可以运行：

```sh
pnpm note theory story-first "先有故事，再有镜头"
pnpm note collection creator-series "某博主｜某组教程"
```

新建命令不会覆盖已有文件。网站自动收录该目录下的 `.md`；目录页、最近更新、搜索、标签、星标和反向引用都无需手动维护。开发预览时保存即可更新；正式网站需要重新构建发布。

```yaml
---
title: "笔记标题"
date: 2026-11-16
updated: 2026-11-18 # 可选，修改后填写；最近更新按它排序
category: "编导理论与创作逻辑"
tags: [故事, 情绪]
star: true
source: "来源名称｜https://example.com/video"
summary: "一句话说明这篇笔记解决什么问题。"
---
```

`category` 必须与所在目录对应的中文板块名一致。`star` 用布尔值 `true/false`；星标由作者在 Markdown 中管理，公开访客不会改变你的收藏。`source` 可以是网址、视频编号与时间或“自写笔记”，避免填写不希望公开的个人信息和本机路径。

| 目录 | 板块 |
| --- | --- |
| `collection/` | 合集教程总览库 |
| `ai-tool/` | AI工具实操库 |
| `theory/` | 编导理论与创作逻辑 |
| `prompt/` | 提示词工程库 |
| `breakdown/` | 爆款拆解库 |
| `review/` | 实战复盘库 |
| `reference/` | 素材参考库 |
| `template/` | 模板库 |
| `resource-index/` | 资源索引库 |

## 链接、图片与提示词

在普通笔记中写 `[查看完整底稿](../collection/v2.md)`；在底稿中写 `[查看知识点](../theory/natural-performance.md)`。两边都可以直接跳转，文章底部“哪些手稿引用了本篇”还会自动显示站内反向引用。链接建议保持 `.md` 后缀，发布时自动转换为网页链接。单篇 URL 可直接分享、收藏与刷新。

图片放在 `docs/public/images/`，正文写 `![图片说明](/images/my-image.jpg)`。原画面可点击或按 Enter 放大，按 Esc 关闭。无需在 Markdown 中写 `public`。

提示词使用 `prompt` 代码围栏，上方会自动出现复制按钮：

````md
```prompt
角色先听见【触发信息】，短暂停顿，然后【主要动作】。
```
````

普通 Markdown 的表格、列表、引用和二三级标题均可使用。文章内没有固定导航、搜索框、评论和导出 PDF 功能；目录以可展开方式放在正文上方。主题标签进入聚合页，全文搜索仅在首页打开，检索标题、正文、标签和来源。搜索在浏览器本地完成，无搜索服务账号。

## 首批资料说明

58 篇真实整理笔记，包含 3 篇视频底稿、1 篇去重总览、17 篇知识点、18 条原画面提示词、12 份新增模板、制作框架与核对表，以及 19 张来源截图。原文摘录、节录和新增归纳分别标明；作者名与公开原视频链接暂缺，没有猜测补写。费用、模型与软件版本保留视频当时语境，不当作当前产品核验结论。`breakdown` 和 `review` 等待真实作品与项目补充。

## 更改名字、邮箱与动效

首页、联系方式、加载页分别在 `docs/.vitepress/theme/Home.vue`、`ContactLetter.vue`、`EntryLetter.vue`。网站标题与分享描述在 `docs/.vitepress/config.js`、`docs/index.md`。加载引导每个浏览器会话仅展示一次，约 4–5 秒完成封口停留与启封，可立即跳过；启用系统“减少动态效果”后直接进入。联系方式仅显示邮箱文字和复制按钮。云朵 WebGL 不可用时自动使用 CSS 云朵，不影响导航。

颜色、排版与动效调整放在 `production.css`，已经确认的原始视觉规则在 `style.css`。主字体是本地托管的 Noto Sans SC 子集，许可证在 `docs/public/fonts/OFL.txt`；后来新增的字如果未在子集中，自动使用设备中文字体。无外部字体加载脚本。

## 部署到 GitHub Pages

本仓库使用 GitHub Actions 构建并发布。首次在 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。

修改 `docs/` 中的 Markdown，提交到 `main` 后自动检查内容、运行测试、生成网页并部署。也可在 Actions → Publish Hania knowledge library → Run workflow 手动重试。看到 build 和 deploy 都为绿色，即可打开 Settings → Pages 显示的网址。

`.github/workflows/pages.yml` 从 GitHub Pages 获取网址路径，自动设置 `SITE_BASE`。构建命令为 `pnpm build`，输出目录为项目根目录的 `dist/`。依赖版本锁定在 `pnpm-lock.yaml`；请保留 `.github`、`docs/.vitepress` 等配置目录。

本地预览：`pnpm install --frozen-lockfile`，然后 `pnpm dev`。验证项目站点路径时，PowerShell 中先执行 `$env:SITE_BASE='/yunjian-aigc/'`，再运行 `pnpm build` 和 `pnpm preview`，打开终端提示的网址。开发完成后删除该环境变量即可恢复根目录构建。

公开页面署名使用 Hania，LH 为已确认的个人印章。网站名称当前沿用「云间来信」，可以在确认新名称后统一调整，不影响 GitHub 仓库名称。
