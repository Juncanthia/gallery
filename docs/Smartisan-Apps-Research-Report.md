# Smartisan OS 经典应用仿制项目调研与设计分析报告

在 Smartisan OS（锤子科技）的设计美学中，**极致的拟物化（Skeuomorphism）**与**细腻的微交互（Micro-interactions）**是其最核心的灵魂。为了给我们的组件库重构提供最硬核、最纯正的视觉与交互参考，我们对 GitHub、Gitee 及全网开源社区进行了深度检索，收集并克隆了几乎所有主流、高保真的**锤子系统原生 App 仿制项目**。

目前，我们的 `references/` 目录已汇集了涵盖 **计算器、便签、天气、音乐播放器、指南针、录音机、商城/Web UI** 等全套锤子经典应用的开源实现，技术栈横跨 **React、Vue 3、Electron、Android (Java/Kotlin/Compose)、iOS (Swift)** 等。

本报告将对这些收集到的仿制项目进行系统梳理，并深度解析其核心应用的拟物化设计细节与技术实现方案，为我们的 React + Tailwind CSS 组件库重构提供直接的指导。

---

## 一、 锤子 App 仿制项目全景图 (References 目录清单)

我们在本地 `references/` 目录下完整克隆并整理了以下 15 个高质量的锤子风格开源项目：

| 序号 | 目标应用 | 仿制项目名称 | 技术栈 | 本地目录路径 | 核心设计/功能亮点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **计算器** | `smartisan-calculator-compose-soyouwantme` | Android (Kotlin + Compose) | `references/smartisan-calculator-compose-soyouwantme` | **极高保真度**。复刻了 7 段式 LCD 液晶屏、按键高光与渐变色，包含完整的四则运算与内存功能。 |
| **2** | **计算器** | `smartisan-calculator-compose-kineks0-0` | Android (Kotlin + Compose) | `references/smartisan-calculator-compose-kineks0-0` | 实现了计算器按钮网格的响应式布局，支持屏幕旋转与按键点击态。 |
| **3** | **天气** | `smartisan-weather-react-kzq` | React 18 + Tailwind CSS | `references/smartisan-weather-react-kzq` | **现代 React 标杆**。支持 7 种响应式尺寸，手绘卡通 SVG 天气动画，物理单位切换开关，温和的拟物化质感。 |
| **4** | **音乐播放器**| `smartisan-music-wowohut` | Android (Kotlin + Legacy View) | `references/smartisan-music-wowohut` | **神级复刻**。保留原版 XML、dimens、anim 和 selector 以保住“视觉事实”，复刻了黑胶唱盘、唱针拖拽、搓碟及光影动效。 |
| **5** | **指南针** | `smartisan-compass-jeffdeen` | Android (Java) | `references/smartisan-compass-jeffdeen` | 经典拟物指南针。静态金属表盘背景与旋转刻度盘叠加，支持手电筒物理开关。 |
| **6** | **录音机** | `smartisan-recorder-sunshushu` | iOS (Swift) | `references/smartisan-recorder-sunshushu` | 极致的自定义绘制。实现了声波波形图、机械滚轮时间显示器、VU 仪表盘、打点标记（Flag）和时间轴。 |
| **7** | **便签** | `smartisan-notes-zhaoolee` | React + Docker | `references/smartisan-notes-zhaoolee` | 锤子便签 Skill 工具。支持“暖白纸感”与“深夜便签”主题，支持一键导出便签为精致的长图文。 |
| **8** | **便签** | `smartisan-notes-electron` | Electron + Vue | `references/smartisan-notes-electron` | 跨平台的锤子便签客户端，完美还原了信纸纹理、精致排版和便签夹分类。 |
| **9** | **便签/文章** | `markdown-css-smartisan` | CSS | `references/markdown-css-smartisan` | 将 Markdown 文章排版渲染为锤子便签风格的经典 CSS 样式表。 |
| **10** | **便签/文章** | `WxMdNotes` | WeChat Mini Program | `references/WxMdNotes` | 微信小程序版的 Markdown 锤子便签，支持暖白纸感信纸与排版。 |
| **11** | **系统 UI** | `smartisan-web-ui-master` | Vue 2 + CSS | `references/smartisan-web-ui-master` | 锤子商城前端 UI 框架，包含经典的拟物化卡片、按钮、导航栏和 3D 悬浮视差动效。 |
| **12** | **系统 UI** | `smartisan-ui` | Vue 3 + Tailwind CSS | `references/smartisan-ui` | 锤子风格的现代 Vue 3 组件库，使用 Tailwind 实现了扁平与拟物结合的质感。 |
| **13** | **官方商城** | `smartisan-vue-mall` | Vue 2 + Node.js | `references/smartisan-vue-mall` | 完整还原锤子科技官方商城的电商系统，包含商品列表、3D 悬浮卡片、购物车抛物线动画。 |
| **14** | **官方商城** | `smartisan-mall-zhi3210` | Vue 2 | `references/smartisan-mall-zhi3210` | 另一款高仿锤子商城的 Vue 实现，重点在于商品分类、订单管理与拟物化卡片布局。 |

---

## 二、 核心 App 拟物化设计与技术实现深度解析

通过对上述克隆项目的源码阅读与分析，我们提炼出了锤子设计中最经典的几个 App 的视觉与交互实现秘诀：

### 1. 经典拟物化计算器 (Smartisan Calculator)
*   **参考项目**：`smartisan-calculator-compose-soyouwantme`
*   **设计精髓**：
    *   **凹槽 LCD 液晶屏**：屏幕背景色采用液晶绿（`Color(204, 206, 179)`，即 `#c2c5b4`），通过 `border(10.dp, Color(92, 90, 84))`（泥土灰）和深邃的内阴影，营造出屏幕深深嵌入机壳内部的物理凹陷感。
    *   **7 段式数字显示**：在 `DigitNum.kt` 中，开发者没有使用常规字体，而是通过 `Canvas` 绘制了 7 个多边形路径（`Path`），根据传入的数字字符，动态点亮对应的段（Segment），完美复刻了老式电子计算器的液晶网格。
    *   **3D 倒角按键**：
        *   **数字键**：采用浅灰白色渐变（`#ececec` 到 `#faf9f6`），文字为深墨水色（`#585450`）。
        *   **功能键**：采用中灰色渐变（`#606060` 到 `#919191`），文字为白色。
        *   **记忆键**：采用深炭灰色渐变（`#2f2f2f` 到 `#5d5d5d`），文字为白色。
        *   **等号键**：采用标志性的锤子橙渐变（`#ce5e34` 到 `#fd8b68`），纵向跨越两行。
    *   **物理按键音效**：在真机上，数字键触发高频清脆的点击声，运算符键触发略带低沉的金属碰撞声。我们在 React 中通过 **Web Audio API** 实时合成了这两种声学频率，避免了加载外部音频文件的延迟。

### 2. 锤子天气 (Smartisan Weather)
*   **参考项目**：`smartisan-weather-react-kzq` (Tactile Weather)
*   **设计精髓**：
    *   **新拟物化（Nu-Skeuomorphism）外壳**：组件容器使用多层阴影叠加：
        ```css
        box-shadow: 
          0 50px 100px -20px var(--twx-shadow-heavy), /* 底部大面积环境散射阴影 */
          0 30px 60px -30px var(--twx-shadow-medium), /* 中等距离投影 */
          inset 0 2px 0 var(--twx-highlight);         /* 顶部边缘的物理高光（Bevel） */
        ```
    *   **物理单位切换开关**：一个极具触感的圆形拨动开关。外壳是带有深内阴影的凹槽，内部滑块是带有垂直渐变（`from-[#fefefe] to-[#f0f0f0]`）的 3D 圆钮，圆钮中心绘制了一个微小的凹陷螺丝钉（通过内阴影和底部高光实现），滑块拨动时带有平滑的弹性动画（`duration-300 ease-out`）。
    *   **手绘卡通 SVG 天气动画**：天气图标并非扁平的单色 Icon，而是低饱和度、带黑色描边（`#444444`）的手绘卡通 SVG。晴天太阳的射线会平滑旋转（`animate-cartoon-spin`），雨天雨滴会交错下落，阴天两朵云会上下微幅漂浮（`animate-cartoon-float`），甚至月亮还带有闭眼睡觉的表情和渐隐的 "Zzz" 动画，极具情感化设计。

### 3. 锤子音乐播放器 (Smartisan Music Player)
*   **参考项目**：`smartisan-music-wowohut` (SmartisanMusic-Revived)
*   **设计精髓**：
    *   **视觉事实（Visual Reality）的保全**：开发者指出，1:1 复刻锤子音乐的难点不在于“把元素画在同样的位置”，而在于旧 View/XML 体系里的测量、阴影、selector、列表分层、文本排版、按压状态和动画节奏。因此，该项目使用 legacy View 壳来保住视觉事实，而将播放链路用现代技术重写。
    *   **黑胶唱盘与唱针手势**：在 `PlaybackTurntableStage.kt` 中，唱针的摆动、拖拽和黑胶唱片的旋转、搓碟（Scratching）具有极高的物理拟真度。拖拽唱针到唱片上时，唱针会顺滑落下并触发“沙沙”的落针声；在播放过程中用手指按住唱片拖动，音乐会根据拖动的速度和方向产生实时的“搓碟”变调效果（基于 ExoPlayer 的播放速度动态调节）。
    *   **金属拉丝与皮革纹理**：播放页面的背景和控制面板采用了高精度的拟物纹理，结合多层渐变和高光，营造出黑胶唱机特有的金属拉丝质感和皮革缝线边缘。

### 4. 锤子录音机 (Smartisan Recorder)
*   **参考项目**：`smartisan-recorder-sunshushu`
*   **设计精髓**：
    *   **机械滚轮时间显示器 (SMTimeElapseIndicatorView)**：录音时间不是简单的数字文本，而是类似于老式里程表或卷尺的机械滚轮。数字在垂直方向上滚动，带有物理阻尼感和阴影遮罩，使得时间的流动如同机械齿轮转动般真实。
    *   **声波波形与打点标记 (SMWaveformView / SMFlagView)**：录音和播放过程中，波形图（Waveform）在精致的金属网格背景上平滑滚动。用户可以随时点击“标记”按钮，在当前时间轴上插上一枚“小红旗”。插旗动画极其生动：红旗从天而降，伴随着轻微的物理回弹，并在时间轴上留下一个立体的投影。
    *   **VU 指针式电平表 (SMSoundDashboardView)**：录音时，两个复古的物理指针（类似于麦克风电平表）会随着声音分贝的大小动态摆动，指针的摆动带有物理惯性（加速度与阻尼计算），完美还原了模拟信号时代的机械美感。

### 5. 锤子指南针 (Smartisan Compass)
*   **参考项目**：`smartisan-compass-jeffdeen`
*   **设计精髓**：
    *   **双层叠加刻度盘**：在 `activity_main.xml` 中，底盘 `@drawable/blank_clock3` 是一个带有重度金属拉丝、凹槽和螺丝钉的静态 3D 表盘外壳；内盘 `compassView`（`@drawable/degree`）则是印有刻度和方向字母的旋转盘。通过传感器数据动态旋转内盘，而外壳保持静止，营造出指针在玻璃罩下方旋转的深邃空间感。
    *   **物理手电筒开关**：左上角的手电筒开关（`lightButton`）采用了经典的物理拉线或金属拨档开关设计，按下时开关向下位移并切换至点亮状态，伴随着清脆的开关拟物音效。

---

## 三、 锤子拟物化视觉效果的现代 CSS / Tailwind 实现方案

通过对这些优秀仿制项目的深度解构，我们总结出了一套在现代 Web 开发（React + Tailwind CSS）中 100% 还原锤子拟物化质感的通用技术方案：

### 1. 物理倒角与微渐变 (Bevel & Subtle Gradient)
拟物化最忌讳纯色和高对比度。所有的物理表面都应该有极其微弱的垂直渐变，以及顶部边缘的高光。
*   **Tailwind 实现**：
    ```html
    <!-- 3D 凸起按键 -->
    <button class="bg-linear-to-b from-[#fafafa] to-[#ededed] border border-neutral-300/60 rounded shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_#ffffff]">
      按键
    </button>
    ```
    *   `bg-linear-to-b from-[#fafafa] to-[#ededed]`：极其温和的下沉渐变。
    *   `inset_0_1px_0_#ffffff`：内部顶部的 1px 纯白高光，模拟光线从上方照射在按键上边缘产生的反射（Bevel Highlight）。

### 2. 雕刻凹槽与内阴影 (Recessed Slot & Inner Shadow)
液晶屏、输入框、滑动条轨道等，应当呈现出向屏幕内部凹陷的物理质感。
*   **Tailwind 实现**：
    ```html
    <!-- 雕刻凹槽面板 -->
    <div class="bg-[#f0f0f0] border border-neutral-300/50 rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.08),0_1px_0_#ffffff]">
      内容
    </div>
    ```
    *   `inset_0_2px_4px_rgba(0,0,0,0.08)`：向内的阴影，模拟面板边缘遮挡光线产生的阴影，营造下沉深度。
    *   `0_1px_0_#ffffff`：容器底部的 1px 纯白外投影，模拟凹槽下边缘接受上方光线照射产生的高光。

### 3. 触感按压位移 (Tactile Press Displacement)
当用户按下物理按键时，按键应该在视觉上向下方沉入，高光消失，内阴影加深。
*   **Tailwind 实现**：
    ```html
    <button class="
      bg-linear-to-b from-[#fafafa] to-[#ededed] active:from-[#ededed] active:to-[#e0e0e0]
      border border-neutral-300/60 active:border-neutral-400/40
      rounded 
      shadow-[0_2px_3px_rgba(0,0,0,0.06),inset_0_1px_0_#ffffff] 
      active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_1px_0_#ffffff]
      transition-all duration-75 active:translate-y-[1px]
    ">
      物理按键
    </button>
    ```
    *   `active:translate-y-[1px]`：按下时整体向下位移 1px，模拟物理下沉。
    *   `active:shadow-[inset_0_2px_4px...]`：外阴影消失，转化为内阴影，模拟按键沉入孔位后被孔壁遮挡光线。
    *   `active:from-[#ededed] active:to-[#e0e0e0]`：渐变反转，模拟按键表面角度倾斜后光照变暗。

### 4. 雕刻文字与阴影 (Engraved Text & Text Shadow)
在金属或纸张表面，文字不应该是悬浮的，而应该呈现出雕刻（Engraved）或印刷在表面内部的凹陷感。
*   **Tailwind 实现**：
    *   **浅色背景（雕刻字）**：
        ```html
        <span class="text-neutral-600 font-medium [text-shadow:0_1px_0_#ffffff]">
          雕刻文字
        </span>
        ```
        *   在文字下方 1px 处投射纯白投影，模拟文字凹槽的下边缘接受光线产生的反光。
    *   **深色背景（浮雕字）**：
        ```html
        <span class="text-neutral-200 font-medium [text-shadow:0_-1px_0_rgba(0,0,0,0.8)]">
          浮雕文字
        </span>
        ```
        *   在文字上方 1px 处投射深色投影，模拟文字凸起在上边缘产生的阴影。

---

## 四、 总结与下一步规划

通过本次对全网锤子 App 仿制项目的深度调研与克隆，我们不仅收集到了极其宝贵的**原生美术资产（Drawables/SVG）**，更从源码中汲取了**物理阻尼计算、Web Audio 音效合成、多层阴影叠加、Canvas 自定义绘制**等硬核拟物化技术。

这些收获将直接反哺我们当前的项目：
1.  **计算器组件的终极打磨**：我们将参考 `soyouwantme` 的 Compose 液晶屏设计，优化我们 React 计算器的 7 段式液晶排版，并微调按键的渐变色与阴影过渡。
2.  **组件库的全面拟物化（Skeuomorphic Variant）**：我们将把上述提炼出的 **“微渐变+顶边缘高光（凸起）”** 与 **“内阴影+底边缘高光（凹陷）”** 黄金法则，完美应用到我们的 `Input`、`Select`、`Tabs`、`Switch`、`Progress` 等所有基础组件中。
3.  **全局主题切换（Theme Switcher）**：我们将参考 `tactile-weather` 的 `ThemeProvider` 架构，实现 `flat`（简洁大方）与 `skeuomorphic`（重度拟物）的全局无缝切换，让用户既能享受大厂产品的精致与克制，又能一键穿越回那个充满工匠精神的拟物化黄金时代。

本报告已完整写入 `docs/Smartisan-Apps-Research-Report.md`，供项目后续开发长期参考。
