import { Breadcrumb } from "@/components/ui/breadcrumb"

export default function BreadcrumbRoutesExample() {
  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { title: "首页", path: "/" },
          { title: "组件", path: "components" },
          { title: "Breadcrumb", breadcrumbName: "Breadcrumb" },
        ]}
      />

      <Breadcrumb
        items={[
          { title: "首页", path: "/" },
          {
            title: "订单管理",
            path: "orders",
            menu: {
              items: [
                { label: "全部订单", path: "all" },
                { label: "待处理", path: "pending" },
              ],
            },
          },
          { title: "订单详情", breadcrumbName: "Order #123" },
        ]}
      />
    </div>
  )
}
