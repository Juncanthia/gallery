import { FeatureSteps } from "@/components/ui/chamaac-feature-steps"

const features = [
  {
    step: "01",
    title: "智能分析",
    content: "通过 AI 驱动的数据分析引擎，自动识别业务趋势和异常模式，为决策提供实时洞察。",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
  },
  {
    step: "02",
    title: "自动化工作流",
    content: "拖拽式流程编排，将重复性任务转化为自动化工作流，释放团队生产力。",
    image: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&h=600&fit=crop",
  },
  {
    step: "03",
    title: "实时协作",
    content: "多人实时编辑与评论，版本历史自动保存，团队成员始终保持同步。",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop",
  },
  {
    step: "04",
    title: "安全合规",
    content: "企业级数据加密与访问控制，符合 SOC2 和 GDPR 合规标准，保障数据安全。",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&h=600&fit=crop",
  },
]

export default function Demo() {
  return <FeatureSteps features={features} autoPlayInterval={4000} />
}
