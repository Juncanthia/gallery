import { Spin } from "@/components/core/spin"
export default function SpinBasic() { return <div className="flex gap-4"><Spin /><Spin size="small" /><Spin size="large" /><Spin><span className="ml-2 text-sm text-muted-foreground">加载中...</span></Spin></div> }
