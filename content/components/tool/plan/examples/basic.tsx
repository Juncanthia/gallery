import { Plan } from "@/components/ui/plan"

export default function Demo() {
  return (
    <Plan
      id="plan-demo"
      title="构建用户认证系统"
      description="实现基于 JWT 的用户登录、注册和会话管理功能"
      todos={[
        {
          id: "1",
          label: "设计数据库模型",
          status: "completed",
          description: "创建 users 和 sessions 表，定义字段类型和索引",
        },
        {
          id: "2",
          label: "实现注册接口",
          status: "completed",
          description: "POST /api/auth/register，含密码哈希和邮箱验证",
        },
        {
          id: "3",
          label: "实现登录接口",
          status: "in_progress",
          description: "POST /api/auth/login，返回 JWT access token 和 refresh token",
        },
        {
          id: "4",
          label: "添加中间件鉴权",
          status: "pending",
          description: "在 API 路由层添加 JWT 验证中间件，拦截未授权请求",
        },
        {
          id: "5",
          label: "前端登录页面",
          status: "pending",
          description: "构建登录表单 UI，对接登录接口，处理 token 存储和自动刷新",
        },
        {
          id: "6",
          label: "集成测试",
          status: "pending",
        },
      ]}
    />
  )
}
