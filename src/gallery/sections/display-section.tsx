import { useState } from "react";
import { GallerySection, DemoRow, DemoCard, SectionGroup } from "../gallery-section";
import { Button } from "@/components/base/button";
import { Badge } from "@/components/base/badge";
import { Kbd, KbdGroup } from "@/components/base/kbd";
import { Separator } from "@/components/base/separator";
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup, AvatarGroupCount } from "@/components/base/avatar";
import { Text, Title, Paragraph } from "@/components/base/typography";
import { Statistic, StatisticDiff } from "@/components/base/statistic";
import { Alert } from "@/components/base/alert";
import { Card } from "@/components/base/card";
import { Skeleton, SkeletonAvatar, SkeletonButton } from "@/components/base/skeleton";
import { Result } from "@/components/base/result";
import { BorderBeam } from "@/components/base/border-beam";
import { Table } from "@/components/base/table";
import { Descriptions } from "@/components/base/descriptions";
import { Timeline } from "@/components/base/timeline";
import { Steps } from "@/components/base/steps";
import {
  Files, FolderItem, FolderTrigger, FolderContent, FileItem,
} from "@/components/base/file-tree";
import { ChevronRight, Download, Plus, Trash2, Users, DollarSign, TrendingUp, FileText, FolderOpen } from "lucide-react";

const TABLE_DATA = [
  { invoice: "INV-001", status: "Paid", method: "Credit Card", amount: "$250.00" },
  { invoice: "INV-002", status: "Pending", method: "Bank Transfer", amount: "$150.00" },
  { invoice: "INV-003", status: "Unpaid", method: "PayPal", amount: "$350.00" },
  { invoice: "INV-004", status: "Paid", method: "Credit Card", amount: "$450.00" },
];

export function DisplaySection() {
  const [stepsVal, setStepsVal] = useState(1);

  return (
    <>
      <SectionGroup title="General" description="Core interactive elements and primitive building blocks.">
        <GallerySection id="button" title="Button" description="Trigger actions and commands.">
          <DemoRow label="Variants">
            <Button>Default</Button>
            <Button variant="filled">Secondary</Button>
            <Button variant="outlined">Outline</Button>
            <Button variant="text">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button color="danger" variant="solid">Destructive</Button>
          </DemoRow>
          <DemoRow label="Sizes">
            <Button size="small">Small</Button>
            <Button>Default</Button>
            <Button size="large">Large</Button>
            <Button shape="square"><Plus className="size-4" /></Button>
          </DemoRow>
          <DemoRow label="With icons / states">
            <Button><Download className="size-4" /> Download</Button>
            <Button color="danger" variant="solid"><Trash2 className="size-4" /> Delete</Button>
            <Button variant="outlined"><ChevronRight className="size-4" /> Continue</Button>
            <Button disabled>Disabled</Button>
          </DemoRow>
        </GallerySection>

        <GallerySection id="badge" title="Badge" description="Small status labels.">
          <DemoRow label="Variants">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="ghost">Ghost</Badge>
          </DemoRow>
        </GallerySection>

        <GallerySection id="avatar" title="Avatar" description="User profile pictures and groups.">
          <DemoRow label="Sizes">
            <Avatar size="sm"><AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=60" /><AvatarFallback>SM</AvatarFallback></Avatar>
            <Avatar><AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=60" /><AvatarFallback>MD</AvatarFallback></Avatar>
            <Avatar size="lg"><AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=60" /><AvatarFallback>LG</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
          </DemoRow>
          <DemoRow label="Group">
            <AvatarGroup>
              <Avatar><AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=60" /><AvatarFallback>A</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>BC</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>DE</AvatarFallback></Avatar>
              <AvatarGroupCount>+8</AvatarGroupCount>
            </AvatarGroup>
          </DemoRow>
        </GallerySection>

        <GallerySection id="kbd" title="Kbd" description="Keyboard shortcut display.">
          <DemoRow label="Keys">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
            <KbdGroup><Kbd>⌘</Kbd><Kbd>Shift</Kbd><Kbd>P</Kbd></KbdGroup>
            <KbdGroup><Kbd>Ctrl</Kbd><Kbd>C</Kbd></KbdGroup>
            <KbdGroup><Kbd>Alt</Kbd><Kbd>F4</Kbd></KbdGroup>
          </DemoRow>
        </GallerySection>

        <GallerySection id="separator" title="Separator" description="Visual dividers between content.">
          <DemoRow label="Orientations">
            <div className="w-56 space-y-2">
              <p className="text-sm">Above the line</p>
              <Separator />
              <p className="text-sm">Below the line</p>
            </div>
            <div className="flex h-8 items-center gap-3 text-sm">
              <span>Left</span>
              <Separator orientation="vertical" />
              <span>Center</span>
              <Separator orientation="vertical" />
              <span>Right</span>
            </div>
          </DemoRow>
        </GallerySection>
      </SectionGroup>

      <SectionGroup title="Typography" description="Text rendering, headings, and typographic utilities.">
        <GallerySection id="typography" title="Typography" description="Semantic text rendering.">
          <DemoRow label="Headings">
            <div className="space-y-1 w-full">
              <Title level={1}>Heading 1</Title>
              <Title level={2}>Heading 2</Title>
              <Title level={3}>Heading 3</Title>
              <Title level={4}>Heading 4</Title>
              <Title level={5}>Heading 5</Title>
            </div>
          </DemoRow>
          <DemoRow label="Text variants">
            <Text>Default</Text>
            <Text variant="secondary">Secondary</Text>
            <Text variant="success">Success</Text>
            <Text variant="warning">Warning</Text>
            <Text variant="danger">Danger</Text>
            <Text variant="disabled">Disabled</Text>
          </DemoRow>
          <DemoRow label="Decorations">
            <Text underline>Underline</Text>
            <Text italic>Italic</Text>
            <Text del>Strikethrough</Text>
            <Text mark>Highlight</Text>
            <Text code>code()</Text>
          </DemoRow>
          <DemoRow label="Paragraph">
            <Paragraph className="max-w-sm">
              The quick brown fox jumps over the lazy dog. A pangram containing every letter of the alphabet at least once.
            </Paragraph>
          </DemoRow>
        </GallerySection>

        <GallerySection id="statistic" title="Statistic" description="Key metrics and numeric values — numbers animate on mount.">
          <DemoRow label="Metrics">
            <DemoCard>
              <div className="space-y-1">
                <Statistic title="Total Users" value={128430} />
              </div>
              <div className="space-y-1">
                <Statistic title="Revenue" value={24680} prefix="$" precision={2} groupSeparator="," />
              </div>
              <div className="space-y-1">
                <Statistic title="Completion" value={87.5} suffix="%" precision={1} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">MoM Change</p>
                <div className="flex gap-4 text-lg font-semibold">
                  <StatisticDiff value={12.5} />
                  <StatisticDiff value={-3.2} />
                </div>
              </div>
            </DemoCard>
          </DemoRow>
          <DemoRow label="With icons">
            <DemoCard>
              {[
                { icon: <Users className="size-5 text-blue-600" />, bg: "bg-blue-100 dark:bg-blue-900/30", title: "Active Users", value: 4231 },
                { icon: <DollarSign className="size-5 text-green-600" />, bg: "bg-green-100 dark:bg-green-900/30", title: "MRR", value: 8450, prefix: "$" },
                { icon: <TrendingUp className="size-5 text-orange-600" />, bg: "bg-orange-100 dark:bg-orange-900/30", title: "Growth", value: 18.2, suffix: "%", precision: 1 },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${item.bg}`}>{item.icon}</div>
                  <Statistic title={item.title} value={item.value} prefix={item.prefix} suffix={item.suffix} precision={item.precision} />
                </div>
              ))}
            </DemoCard>
          </DemoRow>
          <DemoRow label="Formatter">
            <DemoCard>
              <Statistic
                title="Conversion"
                value={0.218}
                formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
              />
              <Statistic
                title="Custom render"
                value={98420}
                valueRender={(node) => <span className="text-green-600">{node}</span>}
              />
            </DemoCard>
          </DemoRow>
        </GallerySection>
      </SectionGroup>

      <SectionGroup title="Data Display" description="Components for presenting structured information.">
        <GallerySection id="alert" title="Alert" description="Contextual feedback messages.">
          <DemoRow label="API">
            <div className="w-full max-w-lg space-y-3">
              <Alert
                type="success"
                title="Heads up"
                description="Your account has been successfully updated."
                showIcon
              />
              <Alert
                type="error"
                title="Error"
                description="Something went wrong. Please try again later."
                closable
              />
            </div>
          </DemoRow>
        </GallerySection>

        <GallerySection id="card" title="Card" description="Content containers with structured layout.">
          <DemoRow label="API">
            <Card
              title="Team Members"
              description="Manage your team and their access."
              extra={<Badge variant="secondary">3</Badge>}
              actions={[
                <Button key="invite" size="small" variant="text">Invite</Button>,
                <Button key="manage" size="small" variant="text">Manage</Button>,
              ]}
              hoverable
              className="w-72"
            >
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Avatar size="sm"><AvatarFallback>JD</AvatarFallback></Avatar>
                  <Avatar size="sm"><AvatarFallback>AS</AvatarFallback></Avatar>
                  <Avatar size="sm"><AvatarFallback>MK</AvatarFallback></Avatar>
                </div>
                <p className="text-sm text-muted-foreground">API-first title / extra / actions.</p>
              </div>
            </Card>
            <Card
              size="small"
              title="Small Card"
              description="Compact variant."
              variant="borderless"
              className="w-56 bg-muted/40"
            >
              <p className="text-sm text-muted-foreground">Less padding, same structure.</p>
            </Card>
            <Card loading title="Loading Card" className="w-64" />
          </DemoRow>
        </GallerySection>

        <GallerySection id="skeleton" title="Skeleton" description="Loading placeholder states.">
          <DemoRow label="Primitive">
            <div className="space-y-2 w-48">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <Skeleton className="h-32 w-48 rounded-lg" />
          </DemoRow>
          <DemoRow label="API">
            <Skeleton avatar paragraph={{ rows: 3, width: ["100%", "90%", "60%"] }} />
            <div className="flex items-center gap-3">
              <SkeletonAvatar size="lg" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <SkeletonButton />
              <SkeletonButton block />
            </div>
          </DemoRow>
        </GallerySection>

        <GallerySection id="descriptions" title="Descriptions" description="Key-value data display.">
          <DemoRow label="Items API">
            <Descriptions
              title="User Info"
              className="w-full max-w-2xl"
              items={[
                { key: "name", label: "Name", children: "Alice Chen" },
                { key: "role", label: "Role", children: "Engineer" },
                { key: "location", label: "Location", children: "San Francisco" },
                { key: "email", label: "Email", children: "alice@example.com", span: 2 },
                { key: "status", label: "Status", children: <Badge>Active</Badge> },
                { key: "joined", label: "Joined", children: "2023-04-01" },
              ]}
            />
          </DemoRow>
          <DemoRow label="Bordered">
            <Descriptions
              bordered
              title="Project"
              column={2}
              className="w-full max-w-lg"
              items={[
                { key: "status", label: "Status", children: <Badge variant="secondary">In Progress</Badge> },
                { key: "priority", label: "Priority", children: "High" },
                { key: "due", label: "Due Date", children: "2025-12-31" },
                { key: "assignee", label: "Assignee", children: "Bob Smith" },
              ]}
            />
          </DemoRow>
        </GallerySection>

        <GallerySection id="timeline" title="Timeline" description="Chronological event list — items stagger in on render.">
          <DemoRow label="Default">
            <Timeline
              items={[
                { title: "Create your account", content: "Identity verified", color: "success" },
                { title: "Set up your workspace", content: "Invite collaborators" },
                { title: "Invite team members", content: "Pending invites" },
                { title: "Launch your project", content: "Waiting for release", pending: true },
              ]}
            />
            <Timeline
              mode="alternate"
              items={[
                { title: "2024 Q1 — Planning", content: "Roadmap", label: "Jan" },
                { title: "2024 Q2 — Development", content: "Build", label: "Apr" },
                { title: "2024 Q3 — Beta", content: "Pilot", label: "Jul" },
                { title: "2024 Q4 — Launch", content: "Release", label: "Oct", color: "success" },
              ]}
            />
          </DemoRow>
        </GallerySection>

        <GallerySection id="steps" title="Steps" description="Multi-step progress tracker — icons animate on state change.">
          <DemoRow label="Horizontal">
            <div className="w-full max-w-xl space-y-4">
              <Steps
                current={stepsVal}
                onChange={setStepsVal}
                items={[
                  { title: "Account", description: "Create account" },
                  { title: "Profile", content: "Set up profile" },
                  { title: "Billing", description: "Add payment" },
                  { title: "Done", description: "All set!" },
                ]}
              />
              <div className="flex gap-2">
                <Button size="small" variant="outlined" disabled={stepsVal === 0} onClick={() => setStepsVal((v) => v - 1)}>Prev</Button>
                <Button size="small" disabled={stepsVal === 3} onClick={() => setStepsVal((v) => v + 1)}>Next</Button>
              </div>
            </div>
          </DemoRow>
          <DemoRow label="Vertical">
            <Steps
              orientation="vertical"
              current={1}
              items={[
                { title: "Submitted", description: "2024-01-10" },
                { title: "In Review", description: "Processing..." },
                { title: "Approved", description: "Pending" },
              ]}
            />
          </DemoRow>
          <DemoRow label="Dot">
            <Steps
              type="dot"
              current={2}
              items={[
                { title: "Queued", content: "Waiting" },
                { title: "Running", content: "Processing" },
                { title: "Review", content: "Current" },
                { title: "Done", content: "Finish" },
              ]}
            />
          </DemoRow>
        </GallerySection>

        <GallerySection id="result" title="Result" description="Feedback for operation outcomes.">
          <DemoRow label="Status types">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              {(["success", "error", "warning", "info", "404", "403", "500"] as const).map((s) => (
                <div key={s} className="rounded-lg border bg-muted/20 py-2">
                  <Result status={s} title={s.toUpperCase()} subTitle={`status: ${s}`} className="py-3" />
                </div>
              ))}
            </div>
          </DemoRow>
        </GallerySection>

        <GallerySection id="file-tree" title="File Tree" description="Hierarchical file explorer.">
          <DemoRow label="Explorer">
            <div className="w-64 rounded-md border bg-background text-sm font-mono">
              <Files>
                <FolderItem value="src">
                  <FolderTrigger gitStatus="modified">src</FolderTrigger>
                  <FolderContent>
                    <FolderItem value="components">
                      <FolderTrigger>components</FolderTrigger>
                      <FolderContent>
                        <FileItem icon={FileText} gitStatus="modified">button.tsx</FileItem>
                        <FileItem icon={FileText} gitStatus="untracked">dialog.tsx</FileItem>
                        <FileItem icon={FileText}>tabs.tsx</FileItem>
                      </FolderContent>
                    </FolderItem>
                    <FileItem icon={FileText} gitStatus="modified">App.tsx</FileItem>
                    <FileItem icon={FileText}>main.tsx</FileItem>
                  </FolderContent>
                </FolderItem>
                <FolderItem value="public">
                  <FolderTrigger>public</FolderTrigger>
                  <FolderContent>
                    <FileItem>vite.svg</FileItem>
                  </FolderContent>
                </FolderItem>
                <FileItem icon={FolderOpen}>package.json</FileItem>
                <FileItem icon={FileText} gitStatus="untracked">README.md</FileItem>
              </Files>
            </div>
          </DemoRow>
        </GallerySection>

        <GallerySection id="table" title="Table" description="Structured data in rows and columns.">
          <DemoRow label="Columns API">
            <Table
              bordered
              caption="A list of recent invoices."
              className="max-w-2xl"
              rowKey="invoice"
              rowSelection={{}}
              pagination={{
                pageSize: 2,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
              }}
              dataSource={TABLE_DATA}
              columns={[
                {
                  title: "Invoice",
                  dataIndex: "invoice",
                  className: "font-medium",
                  sorter: true,
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  sorter: true,
                  render: (value) => (
                    <Badge variant={value === "Paid" ? "default" : value === "Pending" ? "secondary" : "destructive"}>
                      {String(value)}
                    </Badge>
                  ),
                },
                { title: "Method", dataIndex: "method" },
                { title: "Amount", dataIndex: "amount", align: "right", sorter: true },
              ]}
            />
          </DemoRow>
          <DemoRow label="Loading / Empty">
            <Table
              size="small"
              loading
              columns={[
                { title: "Name", dataIndex: "name" },
                { title: "Role", dataIndex: "role" },
              ]}
            />
            <Table
              size="small"
              emptyText="No invoices"
              columns={[
                { title: "Invoice", dataIndex: "invoice" },
                { title: "Amount", dataIndex: "amount", align: "right" },
              ]}
              dataSource={[]}
            />
          </DemoRow>
        </GallerySection>

        <GallerySection id="border-beam" title="Border Beam" description="Animated border highlight effect.">
          <DemoRow label="Color variants">
            <div className="relative rounded-xl border p-6 w-44 h-20 flex items-center justify-center text-sm font-medium overflow-hidden">
              Default
              <BorderBeam duration={6} />
            </div>
            <div className="relative rounded-xl border p-6 w-44 h-20 flex items-center justify-center text-sm font-medium overflow-hidden">
              Blue
              <BorderBeam duration={4} colorFrom="#3b82f6" colorTo="#06b6d4" />
            </div>
            <div className="relative rounded-xl border p-6 w-44 h-20 flex items-center justify-center text-sm font-medium overflow-hidden">
              Green
              <BorderBeam duration={8} colorFrom="#22c55e" colorTo="#84cc16" />
            </div>
          </DemoRow>
        </GallerySection>
      </SectionGroup>
    </>
  );
}
