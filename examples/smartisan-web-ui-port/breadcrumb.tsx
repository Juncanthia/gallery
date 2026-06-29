import { DemoSurface, SmBreadcrumb, SmBreadcrumbItem } from "./shared"

export default function SmartisanWebUiBreadcrumbDemo() {
  return (
    <div className="w-full overflow-x-auto px-2 py-4">
      <DemoSurface>
        <p className="my-2">
          <SmBreadcrumb>
            <SmBreadcrumbItem>首页</SmBreadcrumbItem>
            <span className="mx-2 text-[#b5b5b5]">/</span>
            <SmBreadcrumbItem>组件</SmBreadcrumbItem>
            <span className="mx-2 text-[#b5b5b5]">/</span>
            <SmBreadcrumbItem>Breadcrumb</SmBreadcrumbItem>
          </SmBreadcrumb>
        </p>
      </DemoSurface>
    </div>
  )
}
