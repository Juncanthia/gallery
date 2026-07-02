import { IssueReportForm } from "@/components/templates/form/issue-report-form"

const demoData = {
  title: "Report an Issue",
  teams: ["Engineering", "Product", "Design", "Marketing", "Operations"],
  locations: ["New York - HQ", "San Francisco", "London", "Remote"],
  categories: {
    Software: ["Business App", "Email", "VPN", "Browser", "OS"],
    Hardware: ["Computer", "Monitor", "Keyboard", "Mouse", "Printer"],
    Network: ["Wi-Fi", "Ethernet", "VPN Access"],
    Access: ["Account", "Permissions", "Password Reset"],
  },
  impacts: [
    { value: "critical", label: "Critical - Work stopped" },
    { value: "high", label: "High - Major feature broken" },
    { value: "medium", label: "Medium - Workaround available" },
    { value: "low", label: "Low - Minor inconvenience" },
  ],
  urgencies: [
    { value: "immediate", label: "Immediate" },
    { value: "today", label: "Today" },
    { value: "this-week", label: "This week" },
    { value: "no-rush", label: "No rush" },
  ],
  frequencies: [
    { value: "constant", label: "Constant" },
    { value: "frequent", label: "Frequent" },
    { value: "occasional", label: "Occasional" },
    { value: "once", label: "Happened once" },
  ],
  attemptedActions: [
    "Restarted the application",
    "Cleared browser cache",
    "Restarted computer",
    "Checked internet connection",
    "Contacted a colleague",
  ],
}

export default function Demo() {
  return (
    <div className="max-w-2xl">
      <IssueReportForm
        data={demoData}
        actions={{
          onSubmit: (formData) => console.log("Issue reported:", formData),
        }}
        appearance={{ showTitle: true }}
      />
    </div>
  )
}
