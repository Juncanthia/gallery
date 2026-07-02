import { Cascader } from "@/components/core/cascader"
export default function Cs() {
  return <Cascader options={[{ label: "浙江", value: "zj", children: [{ label: "杭州", value: "hz" }, { label: "宁波", value: "nb" }] }]} placeholder="请选择地区" className="w-48" />
}
