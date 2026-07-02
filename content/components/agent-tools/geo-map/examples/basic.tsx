import { GeoMap } from "@/components/agent-tools/geo-map/geo-map"

export default function Demo() {
  return (
    <GeoMap
      id="geo-map-demo"
      title="办公室分布"
      description="全球主要办公地点概览"
      markers={[
        {
          id: "beijing",
          lat: 39.9042,
          lng: 116.4074,
          label: "北京总部",
          description: "朝阳区建国路88号",
          tooltip: "hover",
          icon: { type: "dot", color: "#ef4444", radius: 8 },
        },
        {
          id: "shanghai",
          lat: 31.2304,
          lng: 121.4737,
          label: "上海分部",
          tooltip: "hover",
          icon: { type: "emoji", value: "🏢" },
        },
        {
          id: "tokyo",
          lat: 35.6762,
          lng: 139.6503,
          label: "东京办事处",
          tooltip: "hover",
          icon: { type: "emoji", value: "🗼" },
        },
        {
          id: "sf",
          lat: 37.7749,
          lng: -122.4194,
          label: "旧金山研发中心",
          description: "美国加州旧金山",
          tooltip: "hover",
          icon: {
            type: "image",
            url: "https://flagcdn.com/w40/us.png",
            width: 24,
            height: 24,
          },
        },
      ]}
      viewport={{ mode: "fit", target: "markers", padding: 40 }}
      showZoomControl
    />
  )
}
