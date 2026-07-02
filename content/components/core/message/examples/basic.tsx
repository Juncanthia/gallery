import { Message } from "@/components/core/message"
import { Button } from "@/components/core/button"
export default function Msg() { return <div className="flex gap-2"><Button size="small" variant="outlined" onClick={() => Message.success("操作成功")}>成功提示</Button><Button size="small" variant="outlined" onClick={() => Message.error("操作失败")}>错误提示</Button></div> }
