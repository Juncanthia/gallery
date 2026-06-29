import { Calculator } from "@/components/composite/calculator";

export default function SmartisanCalculatorExample() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-neutral-50/50 rounded-lg border border-neutral-200/50">
      <div className="text-center max-w-md">
        <h4 className="text-sm font-semibold text-neutral-800 mb-1">
          经典拟物化计算器 (Smartisan OS Calculator)
        </h4>
        <p className="text-xs text-neutral-500">
          复刻自 Smartisan OS 经典系统计算器。支持完整的四则运算、内存存储（mc, m+, m-, mr）、键盘快捷键支持，以及基于 Web Audio API 实时生成的物理触感按键音效。
        </p>
      </div>

      <div className="flex justify-center w-full py-4">
        <Calculator />
      </div>

      <div className="text-[10px] text-neutral-400 font-mono text-center">
        提示：支持键盘数字键及 +, -, *, /, Enter, Backspace, Esc 键操作
      </div>
    </div>
  );
}
