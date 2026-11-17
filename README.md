# Pocket Mappori iOS Web

Pocket Mappori 1.7.6.5 的 iOS Web/PWA 版本，包含精灵球主屏图标和本次功能修改。

当前 iOS 版本会优先选择可用的 GitHub CDN 节点，并把同一个节点作为整棵
模块树的唯一来源；全部节点不可用时才回退到 GitHub Pages 本地资源。

## 在 iPhone Safari 中打开

在 iPhone Safari 中打开：

`https://aheidashuaige-coder.github.io/pocket-mappori-ios/?launch=1765&build=20261117`

然后按以下步骤安装到主屏：

1. 使用 Safari 打开上面的 HTTPS 地址。
2. 等待地图或首页完整显示。
3. 点击 Safari 底部的“分享”按钮。
4. 向下找到并点击“添加到主屏幕”。
5. 确认名称后点击“添加”。
6. 从桌面上的“Pocket Mappori”图标启动。

首次使用定位功能时，选择“允许”，并确保“设置 → 隐私与安全性 → 定位服务 → Safari 网站”没有被关闭。

如果此前已经添加过旧图标，请先删除旧主屏图标，再使用
`https://aheidashuaige-coder.github.io/pocket-mappori-ios/?launch=1765&build=20261117`
重新添加，避免 Safari 继续使用旧版启动缓存。

不要直接双击本地 `index.html`，也不要通过 `file://` 地址打开。iOS 需要通过 HTTPS 访问才能正常加载模块并申请定位权限。

## 部署选项

- GitHub Pages：仓库设置中选择 `Deploy from a branch`，分支 `main`，目录 `/docs`。
- 任意 HTTPS 静态网站：上传 `docs/` 即可。
- Xcode 原生封装：在 macOS 安装依赖后运行 `npm install`、`npx cap add ios`、`npx cap sync ios` 和 `npx cap open ios`。真机 IPA 需要 Apple 开发签名。

## 隐私

本仓库不包含用户存档、游戏进度、定位记录或签名密钥。存档只保留在用户设备上。

## 1.7.6.5 修改

- 保留 iOS Web/PWA 启动与精灵球主屏图标。
- 宝可梦盒子默认按全国图鉴编号升序排列，同种宝可梦连续显示。
- 神秘交换每日不限次数，交换完成后没有宝可梦冷却，可立即继续交换。
- 家园玩法中的漫图点消耗减少 30%。
- 自动托管仅在战斗界面提供，不再放在退出战斗面板或全局设置中。
- 已使用旧版导出存档完成 1.7.6.5 导入与恢复验证。
- 存档导入兼容神秘交换 `0` 冷却记录。
- Safari 启动改为多节点测速、单一来源加载，并在成功后缓存运行资源。
