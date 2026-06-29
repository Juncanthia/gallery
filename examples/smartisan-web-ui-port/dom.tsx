import { DemoSurface } from "./shared"

export default function SmartisanWebUiDomDemo() {
  return (
    <div className="w-full overflow-x-auto px-2 py-4">
      <DemoSurface>
        <h1 className="my-2 text-left text-[50px] font-[500] leading-[1.12] text-[#333333]">H1 : 这是一段H1标签文本</h1>
        <h2 className="my-2 text-left text-[35px] font-[500] leading-[1.16] text-[#323232]">H2 : 这是一段H2标签文本</h2>
        <h3 className="my-2 text-left text-[30px] font-[700] leading-[1.16] text-[#b5b5b5]">H3 : 这是一段H3标签文本</h3>
        <h4 className="my-2 text-left text-[18px] font-[900] leading-[1.2] text-[#5079d9]">H4 : 这是一段H4标签文本</h4>
        <h5 className="my-2 text-left text-[18px] font-[700] leading-[1.2] text-[#333333]">H5 : 这是一段H5标签文本</h5>
        <h6 className="my-2 text-left text-[15px] font-[700] leading-[1.2] text-[#6e8bdd]">H6 : 这是一段H6标签文本</h6>
      </DemoSurface>
    </div>
  )
}
