import { Note } from "@/components/base/note"

export default function SmartisanNoteExample() {
  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          经典锤子便签 (Smartisan Note)
        </h4>
        <Note titleText="Smartisan Note">
          <p>这是一个完美复刻 Smartisan OS 经典便签的 Web 组件。</p>
          <p>顶部压条采用了极具质感的深色皮革材质，左侧两颗精密的金属铆钉闪烁着微弱的光泽，完美重现了物理世界中文件夹压条的工艺细节。</p>
          <p>正文纸张背景则带有温和的横格信纸线，每一行文字都完美契合横格的间距，极大地提升了阅读的仪式感与舒适度。</p>
          <p>你可以用它来撰写随笔、记录待办事项，或者作为精美卡片嵌入到你的技术文档和博客中。</p>
        </Note>
      </div>
    </div>
  )
}
