# Pocket Mappori iOS Web

Pocket Mappori 1.7.5.2 的 iOS Web/PWA 版本，包含精灵球主屏图标和本次功能修改。

## 在 iPhone Safari 中打开

GitHub Pages 启用后，在 iPhone Safari 中打开：

`https://<你的 GitHub 用户名>.github.io/pocket-mappori-ios/`

然后按以下步骤安装到主屏：

1. 使用 Safari 打开上面的 HTTPS 地址。
2. 等待地图或首页完整显示。
3. 点击 Safari 底部的“分享”按钮。
4. 向下找到并点击“添加到主屏幕”。
5. 确认名称后点击“添加”。
6. 从桌面上的“Pocket Mappori”图标启动。

首次使用定位功能时，选择“允许”，并确保“设置 → 隐私与安全性 → 定位服务 → Safari 网站”没有被关闭。

不要直接双击本地 `index.html`，也不要通过 `file://` 地址打开。iOS 需要通过 HTTPS 访问才能正常加载模块并申请定位权限。

## 部署选项

- GitHub Pages：仓库设置中选择 `Deploy from a branch`，分支 `main`，目录 `/docs`。
- 任意 HTTPS 静态网站：上传 `docs/` 即可。
- Xcode 原生封装：在 macOS 安装依赖后运行 `npm install`、`npx cap add ios`、`npx cap sync ios` 和 `npx cap open ios`。真机 IPA 需要 Apple 开发签名。

## 隐私

本仓库不包含用户存档、游戏进度、定位记录或签名密钥。存档只保留在用户设备上。
