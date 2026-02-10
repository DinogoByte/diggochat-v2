# Diggo Chat Next 品牌定制记录

> 本文档记录了从 LobeHub/LobeChat 上游 fork 后所做的品牌定制修改。
> 当执行 `git pull --rebase upstream` 后如果产生冲突或被覆盖，可参考此文档快速恢复。

---

## 一、核心品牌常量

### 1. BRANDING_NAME: `LobeHub` → `Diggo Chat Next`

**文件**: `packages/business/const/src/branding.ts`

```ts
// before
export const BRANDING_NAME = 'LobeHub';

// after
export const BRANDING_NAME = 'Diggo Chat Next';
```

> 此常量影响全局：页面 title、PWA manifest name、metadata 等都从此处读取。

### 2. isCustomBranding 兼容

**文件**: `packages/const/src/version.ts`

```ts
// before
export const isCustomBranding = BRANDING_NAME !== 'LobeHub';

// after
export const isCustomBranding = BRANDING_NAME !== 'LobeHub' && BRANDING_NAME !== 'Diggo Chat Next';
```

> 上游用 `isCustomBranding` 判断是否为第三方品牌（会隐藏 logo 等），我们需要排除自己的品牌名。

### 3. 下载客户端 URL

**文件**: `packages/const/src/url.ts`

```ts
// before
export const DOWNLOAD_URL = {
  default: urlJoin(OFFICIAL_SITE, '/downloads'),
  // ...
};

// after
export const DOWNLOAD_URL = {
  default: 'https://www.silvermash.com/diggo-chat-next/Diggo%20Chat%20Next-1.0.2.dmg',
  // ...
};
```

### 4. 默认 Inbox 头像

**文件**: `packages/const/src/meta.ts`

```ts
// before
export const DEFAULT_INBOX_AVATAR = BRANDING_LOGO_URL || '/avatars/lobe-ai.png';

// after
export const DEFAULT_INBOX_AVATAR = BRANDING_LOGO_URL || '/avatars/diggo-chat.png';
```

> 需要确保 `public/avatars/diggo-chat.png` 存在（从 `new-icon.png` 复制而来）。

---

## 二、"Lobe AI" → "Diggo Chat" 文本替换

以下文件中硬编码了 `'Lobe AI'`，需全部替换为 `'Diggo Chat'`：

| 文件路径                                                                                | 修改内容                                      |
| --------------------------------------------------------------------------------------- | --------------------------------------------- |
| `src/app/[variants]/(main)/home/_layout/Body/Agent/List/InboxItem.tsx`                  | `inboxAgentTitle = 'Diggo Chat'`              |
| `src/app/[variants]/(main)/agent/_layout/Sidebar/Header/Agent/index.tsx`                | `displayTitle = isInbox ? 'Diggo Chat' : ...` |
| `src/app/[variants]/(main)/agent/features/Conversation/AgentWelcome/index.tsx`          | `displayTitle` + `appName: 'Diggo Chat'`      |
| `src/app/[variants]/(main)/agent/profile/features/AgentSettings/Content.tsx`            | `displayTitle = isInbox ? 'Diggo Chat' : ...` |
| `src/app/[variants]/(main)/group/features/Conversation/AgentWelcome/index.tsx`          | `appName: 'Diggo Chat'`                       |
| `src/app/[variants]/(mobile)/(home)/features/SessionListContent/Inbox/index.tsx`        | `aria-label` + `title`                        |
| `src/app/[variants]/(mobile)/chat/features/ChatHeader/ChatHeaderTitle.tsx`              | `displayTitle`                                |
| `src/app/[variants]/(mobile)/chat/features/Topic/features/AgentConfig/Header/index.tsx` | `displayTitle`                                |
| `src/app/[variants]/onboarding/features/TelemetryStep.tsx`                              | `name: 'Diggo Chat'`                          |
| `src/app/[variants]/(desktop)/desktop-onboarding/features/WelcomeStep.tsx`              | `name: 'Diggo Chat'`                          |
| `src/features/ShareModal/ShareImage/Preview.tsx`                                        | `displayTitle`                                |
| `src/features/Conversation/hooks/useAgentMeta.ts`                                       | `LOBE_AI_TITLE = 'Diggo Chat'`                |
| `src/features/Conversation/hooks/useAgentMeta.test.ts`                                  | 测试断言中的期望值                            |
| `src/features/CommandMenu/AskAgentCommands.tsx`                                         | `handleAgentSelect` 参数                      |

### 快速查找命令

```bash
# 查找所有残留的 'Lobe AI'（排除 node_modules 和 .git）
rg "'Lobe AI'" src/ packages/
```

---

## 三、产品 Logo（左上角 3D 图标）

**文件**: `src/components/Branding/ProductLogo/index.tsx`

上游使用 `@lobehub/ui/brand` 的 `<LobeHub />` 组件渲染 3D logo（从 npmmirror CDN 加载）。
我们直接替换为本地图片。

```tsx
// before
import { LobeHub, type LobeHubProps } from '@lobehub/ui/brand';
import { isCustomBranding } from '@/const/version';
import CustomLogo from './Custom';

export const ProductLogo = memo<ProductLogoProps>((props) => {
  if (isCustomBranding) return <CustomLogo {...props} />;
  return <LobeHub {...props} />;
});

// after
import Image from '@/libs/next/Image';

export const ProductLogo = memo<ProductLogoProps>(({ size = 32, ...rest }) => {
  return (
    <Image
      alt="Diggo Chat"
      height={size}
      src="/avatars/diggo-chat.png"
      unoptimized
      width={size}
      {...rest}
    />
  );
});
```

> 此组件在多处使用：onboarding、settings、auth 页面、分享预览等。改一处全局生效。

---

## 四、加载页面品牌文字

**文件**: `src/components/Loading/BrandTextLoading/index.tsx`

```tsx
// before
import { BrandLoading, LobeHubText } from '@lobehub/ui/brand';
// ...
<BrandLoading size={40} text={LobeHubText} />

// after
import { BrandLoading } from '@lobehub/ui/brand';

const DiggoChatText = () => (
  <span style={{ color: '#fff', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 700 }}>
    Diggo Chat
  </span>
);
// ...
<BrandLoading size={40} text={DiggoChatText} />
```

---

## 五、PWA Manifest（开发环境）

**文件**: `src/app/manifest.ts`

```ts
// 开发环境 fallback 中的 name/short_name/description
name: 'Diggo Chat Next',
short_name: 'Diggo Chat Next',
description: 'Diggo Chat Next Development',
```

> 生产环境自动读取 `BRANDING_NAME`，无需额外修改。

---

## 六、i18n 国际化

### 默认 locale

**文件**: `src/locales/default/chat.ts`

```ts
'inbox.title': 'Diggo Chat',
```

### 所有语言 JSON

**目录**: `locales/*/chat.json`

所有语言文件中的 `"inbox.title"` 值从 `"Lobe AI"` 改为 `"Diggo Chat"`。

涉及语言：ar, bg-BG, de-DE, en-US, es-ES, fa-IR, it-IT, ja-JP, ko-KR, nl-NL, pl-PL, pt-BR, ru-RU, tr-TR, vi-VN, zh-CN, zh-TW

### 批量修改脚本

```bash
cd locales
for f in */chat.json; do
  python3 -c "
import json
with open('$f', 'r') as fp:
    data = json.load(fp)
if data.get('inbox.title') == 'Lobe AI':
    data['inbox.title'] = 'Diggo Chat'
    with open('$f', 'w') as fp:
        json.dump(data, fp, ensure_ascii=False, indent=2)
        fp.write('\n')
    print(f'Updated $f')
"
done
```

---

## 七、静态资源替换

源文件：项目根目录 `new-icon.png`（蓝色圆角方形图标）

### 一键生成所有图标（推荐）

使用 Pillow（`pip3 install Pillow`）+ LANCZOS 高质量重采样，在项目根目录执行：

```bash
python3 << 'PYEOF'
from PIL import Image
import shutil, os

src = Image.open('new-icon.png').convert('RGBA')

# Favicon .ico — 嵌入 7 个尺寸，浏览器自动选最佳
ico_sizes = [(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)]
src.save('public/favicon.ico', format='ICO', sizes=ico_sizes)
src.save('public/favicon-32x32.ico', format='ICO', sizes=[(32,32)])

# dev 版本
shutil.copy('public/favicon.ico', 'public/favicon-dev.ico')
shutil.copy('public/favicon-32x32.ico', 'public/favicon-32x32-dev.ico')

# 所有状态变体
for v in ['favicon-done.ico','favicon-done-dev.ico',
          'favicon-error.ico','favicon-error-dev.ico',
          'favicon-progress.ico','favicon-progress-dev.ico',
          'favicon-32x32-done.ico','favicon-32x32-done-dev.ico',
          'favicon-32x32-error-dev.ico',
          'favicon-32x32-progress.ico','favicon-32x32-progress-dev.ico']:
    p = os.path.join('public', v)
    if os.path.exists(p):
        shutil.copy('public/favicon.ico', p)

# Apple Touch Icon (180x180)
src.resize((180,180), Image.LANCZOS).save('public/apple-touch-icon.png', format='PNG', optimize=True)

# PWA Icons
for size in [192, 512]:
    r = src.resize((size,size), Image.LANCZOS)
    r.save(f'public/icons/icon-{size}x{size}.png', format='PNG', optimize=True)
    r.save(f'public/icons/icon-{size}x{size}.maskable.png', format='PNG', optimize=True)

# Inbox Avatar（保留原始 1024x1024）
shutil.copy('new-icon.png', 'public/avatars/diggo-chat.png')

print('All icons generated!')
PYEOF
```

> 关键点：使用 `Image.LANCZOS` 重采样 + ico 内嵌多尺寸（最大 256x256），确保各分辨率下都清晰。

### 其他

**文件**: `public/not-compatible.html`

```html
<!-- before -->
<title>Browser Not Compatible - LobeHub</title>

<!-- after -->
<title>Browser Not Compatible - Diggo Chat Next</title>
```

---

## 八、完整文件清单

### 代码文件（17 个）

```
packages/business/const/src/branding.ts
packages/const/src/version.ts
packages/const/src/url.ts
packages/const/src/meta.ts
src/components/Branding/ProductLogo/index.tsx
src/components/Loading/BrandTextLoading/index.tsx
src/app/manifest.ts
src/locales/default/chat.ts
src/app/[variants]/(main)/home/_layout/Body/Agent/List/InboxItem.tsx
src/app/[variants]/(main)/agent/_layout/Sidebar/Header/Agent/index.tsx
src/app/[variants]/(main)/agent/features/Conversation/AgentWelcome/index.tsx
src/app/[variants]/(main)/agent/profile/features/AgentSettings/Content.tsx
src/app/[variants]/(main)/group/features/Conversation/AgentWelcome/index.tsx
src/app/[variants]/(mobile)/(home)/features/SessionListContent/Inbox/index.tsx
src/app/[variants]/(mobile)/chat/features/ChatHeader/ChatHeaderTitle.tsx
src/app/[variants]/(mobile)/chat/features/Topic/features/AgentConfig/Header/index.tsx
src/app/[variants]/onboarding/features/TelemetryStep.tsx
src/app/[variants]/(desktop)/desktop-onboarding/features/WelcomeStep.tsx
src/features/ShareModal/ShareImage/Preview.tsx
src/features/Conversation/hooks/useAgentMeta.ts
src/features/Conversation/hooks/useAgentMeta.test.ts
src/features/CommandMenu/AskAgentCommands.tsx
```

### 静态资源文件

```
public/avatars/diggo-chat.png
public/favicon.ico
public/favicon-dev.ico
public/favicon-32x32.ico
public/favicon-32x32-dev.ico
public/favicon-done.ico
public/favicon-done-dev.ico
public/favicon-error.ico
public/favicon-error-dev.ico
public/favicon-progress.ico
public/favicon-progress-dev.ico
public/favicon-32x32-done.ico
public/favicon-32x32-done-dev.ico
public/favicon-32x32-error-dev.ico
public/favicon-32x32-progress.ico
public/favicon-32x32-progress-dev.ico
public/apple-touch-icon.png
public/icons/icon-192x192.png
public/icons/icon-192x192.maskable.png
public/icons/icon-512x512.png
public/icons/icon-512x512.maskable.png
public/not-compatible.html
```

### i18n 文件（17 个语言）

```
locales/*/chat.json  （修改 inbox.title 字段）
```

---

## 九、upstream 同步后的恢复步骤

```bash
# 1. 同步上游
git fetch upstream
git rebase upstream/main

# 2. 解决冲突后，快速检查是否有遗漏
rg "'Lobe AI'" src/ packages/
rg "'LobeHub'" packages/business/const/src/branding.ts packages/const/src/version.ts

# 3. 如果上游新增了 'Lobe AI' 引用，按本文档第二节的模式替换

# 4. 如果静态资源被覆盖，重新执行第六节的命令

# 5. 如果 i18n 文件被覆盖，重新执行第五节的批量脚本
```
