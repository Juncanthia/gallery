# Next.js API Routes（隔离存放，不参与编译）

## 这是什么

这里的文件是集成 Plate.js 编辑器 AI 功能（AI 命令、Copilot 续写）与 Uploadthing 文件上传时，从 Plate 官方 demo（一个 **Next.js** 项目）里原样带过来的服务端路由实现：

- `ai/command/route.ts` + `utils.ts` + `prompt/*.ts` —— AI 编辑指令（生成/编辑/评论/表格）的服务端实现
- `ai/copilot/route.ts` —— AI 自动续写的服务端实现
- `uploadthing/route.ts` —— 文件上传的服务端路由

它们全部依赖 `next/server`（`NextRequest`/`NextResponse`）或 `uploadthing/next`，是 **Next.js App Router 的 `app/api/**/route.ts` 文件约定专属写法**。

## 为什么不在 `src/` 里

这个项目是 **Vite + TanStack Router** 的纯前端 SPA（见 `vite.config.ts` 的 `routesDirectory: "./src/app/routes"`），不是 Next.js：

1. 仓库里**没有安装 `next` 这个包**，这些文件里的 `next/server` import 在 `pnpm typecheck` 下必然报 `TS2307: Cannot find module`。
2. Vite / TanStack Router 都不认识 `app/api/**/route.ts` 这种文件约定，这些文件放在 `src/` 里也**从来没有被当作真实 HTTP 端点执行过**——是完全执行不到的死代码。
3. 前端调用方（`src/components/editor/use-chat.ts`、`src/components/editor/plugins/copilot-kit.tsx`）本身已经写好了针对"路由未实现"场景的 mock/假流式（fake stream）兜底逻辑，注释里明确写着「Remove it when you implement the route」——也就是说 AI 编辑器功能现在完全靠前端 mock 运行，从未真正依赖过这批文件。

这批文件不是这次重构引入的，是更早期集成 Plate 编辑器时的遗留问题：`src/app/api/` 从未出现在 `ARCHITECTURE.md` 的历次审计范围里，属于审计盲区。

## 处理方式

将 `src/app/api/` 整体迁移到 `references/next-api-routes/`（`references/` 已在 `eslint.config.js` 中被 `globalIgnores` 排除，且不在任何 `tsconfig` 的 `include` 范围内，因此不再参与 `pnpm typecheck`/`pnpm lint`）。

- **不删除**：如果未来要给这个项目接一个真实后端（无论是 Next.js 还是其他框架），这里的 prompt 工程逻辑（`utils.ts`、`prompt/*.ts`）和路由骨架仍有参考价值，只是文件里的 `next/server`、`uploadthing/next` 需要替换成目标框架/运行时的等价物（例如通用 Node 场景可用 `uploadthing/server` + 任意 HTTP 框架适配层）。
- **不适配**：本仓库定位是组件展示 Gallery，目前不需要为此单独起一个真实后端服务，因此不在此处做框架迁移。
- `src/lib/uploadthing.ts`（`ourFileRouter` 定义本身）**未移动**，继续留在 `src/lib/`——它使用的 `uploadthing/next` 子路径本身可以独立类型检查通过（不依赖 `next` 包本身的类型），且此前 `ARCHITECTURE.md` 的 Stage A+ 审计已明确判定它是"第三方上传服务封装，App 级服务集成"，保留原位。

## 如果以后要真正实现

1. 起一个独立的后端服务（Node/Express/Hono 等均可），把这里的路由逻辑迁移过去，`next/server` 换成对应框架的 request/response 类型。
2. `uploadthing/route.ts` 的 `createRouteHandler` 换成 `uploadthing/express`、`uploadthing/h3` 等框架适配包（`uploadthing` 本身已提供多框架适配，见其 `package.json` 的 `exports`）。
3. 更新 `src/components/editor/use-chat.ts`、`copilot-kit.tsx` 里的 `api` 地址指向真实后端。
4. 迁移完成后即可删除本目录。
