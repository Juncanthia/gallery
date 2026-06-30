import Input from "@/components/ui/uselayouts-input"

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input placeholder="请输入内容" />
      <Input type="password" placeholder="请输入密码" />
      <Input disabled placeholder="禁用状态" />
    </div>
  )
}
