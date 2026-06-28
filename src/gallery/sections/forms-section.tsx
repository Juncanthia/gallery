import { useState } from "react";
import { GallerySection, DemoRow, SectionGroup } from "../gallery-section";
import { Button } from "@/components/base/button";
import { Input } from "@/components/base/input";
import { Label } from "@/components/base/label";
import { Checkbox, CheckboxGroup, type CheckboxValue } from "@/components/base/checkbox";
import { RadioGroup } from "@/components/base/radio-group";
import { Switch } from "@/components/base/switch";
import { Slider } from "@/components/base/slider";
import { Select } from "@/components/base/select";
import { AutoComplete } from "@/components/base/auto-complete";
import { Toggle } from "@/components/base/toggle";
import { ToggleGroup } from "@/components/base/toggle-group";
import { Rate } from "@/components/base/rate";
import { DatePicker } from "@/components/base/date-picker";
import { AttachmentUpload, type AttachmentFile } from "@/components/base/attachment";
import { Form, FormItem } from "@/components/base/form-field";
import { Bold, Italic, Underline, ChevronLeft as AlignLeft, TextAlignCenter as AlignCenter, Highlighter as AlignRight, Mail, Search } from "lucide-react";

const checkboxOptions = [
  { label: "Apple", value: "apple" },
  { label: "Pear", value: "pear" },
  { label: "Orange", value: "orange", disabled: true },
];

const radioOptions = [
  { label: "Option One", value: "option-1" },
  { label: "Option Two", value: "option-2" },
  { label: "Option Three", value: "option-3" },
  { label: "Disabled", value: "option-4", disabled: true },
];

const alignOptions = [
  { label: <AlignLeft className="size-4" />, value: "left", "aria-label": "Left" },
  { label: <AlignCenter className="size-4" />, value: "center", "aria-label": "Center" },
  { label: <AlignRight className="size-4" />, value: "right", "aria-label": "Right" },
];

const formatOptions = [
  { label: <Bold className="size-4" />, value: "bold", "aria-label": "Bold" },
  { label: <Italic className="size-4" />, value: "italic", "aria-label": "Italic" },
  { label: <Underline className="size-4" />, value: "underline", "aria-label": "Underline" },
];

const initialAttachmentFiles: AttachmentFile[] = [
  {
    uid: "brief",
    name: "product-brief.pdf",
    size: 328_000,
    type: "application/pdf",
    status: "done",
  },
];

export function FormsSection() {
  const [sliderVal, setSliderVal] = useState(40);
  const [radioVal, setRadioVal] = useState("option-1");
  const [switchOn, setSwitchOn] = useState(false);
  const [numVal, setNumVal] = useState(10);
  const [otp, setOtp] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectValue, setSelectValue] = useState<string | undefined>();
  const [selectTags, setSelectTags] = useState<string[]>(["react"]);
  const [checkboxValues, setCheckboxValues] = useState<CheckboxValue[]>(["apple"]);
  const [attachmentFiles, setAttachmentFiles] =
    useState<AttachmentFile[]>(initialAttachmentFiles);
  const enabledCheckboxValues: CheckboxValue[] = checkboxOptions
    .filter((option) => !option.disabled)
    .map((option) => option.value);
  const allChecked = enabledCheckboxValues.every((value) =>
    checkboxValues.includes(value),
  );
  const indeterminate =
    enabledCheckboxValues.some((value) => checkboxValues.includes(value)) &&
    !allChecked;

  return (
    <SectionGroup title="Forms" description="Input controls, selection, and data entry components.">
      <GallerySection id="input" title="Input" description="Single-line text fields.">
        <DemoRow label="Variants">
          <div className="flex flex-col gap-2 w-56">
            <Label htmlFor="demo-input">Default</Label>
            <Input id="demo-input" placeholder="Enter text..." />
          </div>
          <div className="flex flex-col gap-2 w-56">
            <Label htmlFor="demo-email">With prefix</Label>
            <Input id="demo-email" type="email" prefix={<Mail className="size-4" />} placeholder="you@example.com" allowClear />
          </div>
          <div className="flex flex-col gap-2 w-56">
            <Label htmlFor="demo-password">Password</Label>
            <Input.Password
              id="demo-password"
              placeholder="••••••••"
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
            />
          </div>
          <div className="flex flex-col gap-2 w-56">
            <Label htmlFor="demo-search">Search</Label>
            <Input.Search id="demo-search" prefix={<Search className="size-4" />} placeholder="Search..." enterButton allowClear />
          </div>
        </DemoRow>
        <DemoRow label="Addon / status">
          <div className="flex flex-col gap-2 w-72">
            <Label htmlFor="demo-addon">Website</Label>
            <Input id="demo-addon" addonBefore="https://" addonAfter=".com" placeholder="example" />
          </div>
          <div className="flex flex-col gap-2 w-56">
            <Label htmlFor="demo-warning">Warning</Label>
            <Input id="demo-warning" status="warning" placeholder="Warning status" />
          </div>
          <div className="flex flex-col gap-2 w-56">
            <Label htmlFor="demo-error">Error</Label>
            <Input id="demo-error" status="error" placeholder="Error status" />
          </div>
        </DemoRow>
        <DemoRow label="Count / custom search">
          <div className="flex flex-col gap-2 w-56">
            <Label htmlFor="demo-count">Emoji count</Label>
            <Input
              id="demo-count"
              defaultValue="🔥🔥🔥"
              count={{
                show: true,
                max: 4,
                strategy: (text) => Array.from(text).length,
                exceedFormatter: (text, { max }) => Array.from(text).slice(0, max).join(""),
              }}
            />
          </div>
          <div className="flex flex-col gap-2 w-72">
            <Label htmlFor="demo-custom-search">Custom button</Label>
            <Input.Search
              id="demo-custom-search"
              placeholder="Search with custom button"
              enterButton={<Button variant="filled">Go</Button>}
            />
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="textarea" title="Textarea" description="Multi-line text input.">
        <DemoRow label="Variants">
          <div className="flex flex-col gap-2 w-64">
            <Label htmlFor="ta1">Message</Label>
            <Input.TextArea
              id="ta1"
              placeholder="Write your message here..."
              autoSize={{ minRows: 3, maxRows: 6 }}
              count={{
                show: true,
                max: 120,
                formatter: ({ count, maxLength }) => `${count}/${maxLength}`,
              }}
              maxLength={120}
            />
          </div>
          <div className="flex flex-col gap-2 w-64">
            <Label htmlFor="ta2">Disabled</Label>
            <Input.TextArea id="ta2" disabled placeholder="Disabled..." rows={3} />
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="select" title="Select" description="Dropdown option selection.">
        <DemoRow label="Basic / search">
          <div className="flex flex-col gap-2 w-48">
            <Label>Framework</Label>
            <Select
              allowClear
              placeholder="Select..."
              value={selectValue}
              onValueChange={setSelectValue}
              options={[
                {
                  label: "Frontend",
                  options: [
                    { label: "React", value: "react" },
                    { label: "Vue", value: "vue" },
                    { label: "Svelte", value: "svelte" },
                  ],
                },
                {
                  label: "Backend",
                  options: [
                    { label: "Node.js", value: "node" },
                    { label: "Deno", value: "deno" },
                  ],
                },
              ]}
            />
          </div>
          <div className="flex flex-col gap-2 w-48">
            <Label>Search</Label>
            <Select
              showSearch
              placeholder="Search..."
              options={[
                { label: "Option A", value: "a" },
                { label: "Option B", value: "b" },
                { label: "Disabled", value: "c", disabled: true },
              ]}
            />
          </div>
        </DemoRow>
        <DemoRow label="Status / modes">
          <div className="flex flex-col gap-2 w-48">
            <Label>Warning</Label>
            <Select
              status="warning"
              variant="filled"
              placeholder="Filled warning"
              options={[
                { label: "Daily", value: "daily" },
                { label: "Weekly", value: "weekly" },
              ]}
            />
          </div>
          <div className="flex flex-col gap-2 w-72">
            <Label>Tags</Label>
            <Select
              mode="tags"
              allowClear
              placeholder="Add tags..."
              value={selectTags}
              onValueChange={setSelectTags}
              options={[
                { label: "React", value: "react" },
                { label: "Vue", value: "vue" },
                { label: "Svelte", value: "svelte" },
              ]}
            />
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="checkbox" title="Checkbox" description="Binary checked state.">
        <DemoRow label="States">
          <Checkbox label="Default" />
          <Checkbox defaultChecked label="Checked" />
          <Checkbox indeterminate label="Indeterminate" />
          <Checkbox disabled label="Disabled" />
        </DemoRow>
        <DemoRow label="Group">
          <div className="flex flex-col gap-3">
            <Checkbox
              checked={allChecked}
              indeterminate={indeterminate}
              label="Check all"
              onCheckedChange={(checked) => {
                setCheckboxValues((currentValues) => {
                  if (checked) {
                    return Array.from(
                      new Set([...currentValues, ...enabledCheckboxValues]),
                    );
                  }

                  return currentValues.filter(
                    (value) => !enabledCheckboxValues.includes(value),
                  );
                });
              }}
            />
            <CheckboxGroup
              options={checkboxOptions}
              value={checkboxValues}
              onValueChange={setCheckboxValues}
            />
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="radio" title="Radio Group" description="Single selection from a list.">
        <DemoRow label="Options">
          <RadioGroup
            direction="horizontal"
            options={radioOptions}
            value={radioVal}
            onValueChange={setRadioVal}
          />
          <p className="text-xs text-muted-foreground self-end">Selected: <strong>{radioVal}</strong></p>
        </DemoRow>
      </GallerySection>

      <GallerySection id="switch" title="Switch" description="Toggle between two states.">
        <DemoRow label="States">
          <div className="flex items-center gap-3"><Switch checked={switchOn} onCheckedChange={setSwitchOn} /><Label>{switchOn ? "On" : "Off"}</Label></div>
          <div className="flex items-center gap-3"><Switch defaultChecked /><Label>Default on</Label></div>
          <div className="flex items-center gap-3"><Switch disabled /><Label className="text-muted-foreground">Disabled</Label></div>
          <div className="flex items-center gap-3"><Switch loading defaultChecked /><Label className="text-muted-foreground">Loading</Label></div>
        </DemoRow>
        <DemoRow label="Content / sizes">
          <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
          <Switch checkedChildren="1" unCheckedChildren="0" />
          <Switch size="small" checkedChildren="1" unCheckedChildren="0" defaultChecked />
        </DemoRow>
      </GallerySection>

      <GallerySection id="slider" title="Slider" description="Range and value selection.">
        <DemoRow label="Basic / range">
          <div className="space-y-3 w-64">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Value</span><span className="tabular-nums">{sliderVal}</span>
            </div>
            <Slider value={sliderVal} onChange={setSliderVal} min={0} max={100} />
          </div>
          <div className="space-y-2 w-64">
            <p className="text-xs text-muted-foreground">Range (two thumbs)</p>
            <Slider range defaultValue={[20, 80]} min={0} max={100} />
          </div>
          <div className="space-y-2 w-64">
            <p className="text-xs text-muted-foreground">Step = 10</p>
            <Slider defaultValue={50} min={0} max={100} step={10} dots />
          </div>
        </DemoRow>
        <DemoRow label="Marks / tooltip">
          <div className="space-y-2 w-72">
            <p className="text-xs text-muted-foreground">Temperature marks</p>
            <Slider
              defaultValue={37}
              marks={{
                0: "0°C",
                26: "26°C",
                37: "37°C",
                100: { label: <strong>100°C</strong>, className: "text-destructive" },
              }}
              dots
              step={null}
              tooltip={{ formatter: (value) => `${value}°C`, placement: "bottom" }}
            />
          </div>
          <div className="space-y-2 w-64">
            <p className="text-xs text-muted-foreground">Reverse</p>
            <Slider defaultValue={30} reverse tooltip={{ open: true }} />
          </div>
          <div className="h-40 space-y-2">
            <p className="text-xs text-muted-foreground">Vertical</p>
            <Slider orientation="vertical" defaultValue={40} className="h-32" />
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="toggle" title="Toggle / Toggle Group" description="Pressed state controls.">
        <DemoRow label="Individual">
          <Toggle aria-label="Bold"><Bold className="size-4" /></Toggle>
          <Toggle aria-label="Italic"><Italic className="size-4" /></Toggle>
          <Toggle aria-label="Underline" defaultPressed><Underline className="size-4" /></Toggle>
        </DemoRow>
        <DemoRow label="Groups">
          <ToggleGroup type="single" defaultValue="left" options={alignOptions} />
          <ToggleGroup type="multiple" variant="outline" options={formatOptions} />
        </DemoRow>
      </GallerySection>

      <GallerySection id="rate" title="Rate" description="Star rating input with half-star and clear support.">
        <DemoRow label="Basic">
          <Rate defaultValue={3} onChange={(v) => console.log(v)} />
        </DemoRow>
        <DemoRow label="Half star">
          <Rate defaultValue={2.5} allowHalf />
        </DemoRow>
        <DemoRow label="Clear & disable">
          <Rate defaultValue={4} allowClear />
          <Rate defaultValue={3} disabled />
        </DemoRow>
      </GallerySection>

      <GallerySection id="date-picker" title="DatePicker" description="Date selection with calendar popover.">
        <DemoRow label="Basic">
          <DatePicker
            placeholder="Pick a date"
            onChange={(date) => console.log(date)}
          />
        </DemoRow>
        <DemoRow label="Allow clear">
          <DatePicker
            defaultValue={new Date()}
            placeholder="Select date"
            allowClear
          />
        </DemoRow>
        <DemoRow label="With format & disabled">
          <DatePicker
            defaultValue={new Date()}
            format="MM/dd/yyyy"
            disabledDate={(date) => date > new Date()}
          />
          <DatePicker placeholder="Disabled" disabled />
        </DemoRow>
      </GallerySection>

      <GallerySection id="input-number" title="InputNumber" description="Numeric input with step controls.">
        <DemoRow label="Variants">
          <div className="flex flex-col gap-2">
            <Label>Quantity</Label>
            <Input.Number value={numVal} onChange={(v) => setNumVal(v ?? 0)} min={0} max={100} className="w-32" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Price</Label>
            <Input.Number defaultValue={9.99} step={0.01} precision={2} prefix="$" className="w-36" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>No controls</Label>
            <Input.Number defaultValue={42} controls={false} className="w-28" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>With suffix</Label>
            <Input.Number defaultValue={75} suffix="%" min={0} max={100} className="w-32" />
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="input-otp" title="InputOTP" description="One-time password input.">
        <DemoRow label="Lengths">
          <div className="flex flex-col gap-2">
            <Label>6-digit OTP</Label>
            <Input.OTP length={6} separator={3} value={otp} onChange={setOtp} formatter={(value) => value.toUpperCase()} />
            {otp.length === 6 && <p className="text-xs text-muted-foreground">Entered: <strong>{otp}</strong></p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label>4-digit PIN</Label>
            <Input.OTP length={4} mask />
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="auto-complete" title="AutoComplete" description="Input with type-ahead suggestions. Free-text value is allowed.">
        <DemoRow label="Basic">
          <AutoComplete
            placeholder="Search framework..."
            className="w-52"
            options={[
              { label: "React", value: "react" },
              { label: "Vue", value: "vue" },
              { label: "Angular", value: "angular" },
              { label: "Svelte", value: "svelte" },
              { label: "Solid", value: "solid" },
            ]}
          />
        </DemoRow>
        <DemoRow label="With groups">
          <AutoComplete
            placeholder="Search language..."
            className="w-56"
            options={[
              {
                label: "Frontend",
                options: [
                  { label: "TypeScript", value: "ts" },
                  { label: "JavaScript", value: "js" },
                ],
              },
              {
                label: "Backend",
                options: [
                  { label: "Go", value: "go" },
                  { label: "Rust", value: "rust" },
                  { label: "Python", value: "python", disabled: true },
                ],
              },
            ]}
          />
        </DemoRow>
        <DemoRow label="Allow clear">
          <AutoComplete
            placeholder="Select a fruit..."
            allowClear
            className="w-48"
            options={[
              { label: "Apple", value: "apple" },
              { label: "Banana", value: "banana" },
              { label: "Cherry", value: "cherry" },
            ]}
          />
        </DemoRow>
        <DemoRow label="Controlled + onSearch">
          <ControlledAutoComplete />
        </DemoRow>
      </GallerySection>

      <GallerySection id="form" title="Form" description="Layout-first form composition with API items.">
        <DemoRow label="Items API">
          <Form
            layout="horizontal"
            className="max-w-xl"
            items={[
              {
                key: "email",
                label: "Email",
                required: true,
                htmlFor: "form-email",
                control: <Input id="form-email" type="email" placeholder="you@example.com" />,
              },
              {
                key: "role",
                label: "Role",
                htmlFor: "form-role",
                control: (
                  <Select
                    placeholder="Select role"
                    options={[
                      { label: "Admin", value: "admin" },
                      { label: "Editor", value: "editor" },
                    ]}
                  />
                ),
              },
              {
                key: "note",
                label: "Note",
                help: "The lightweight form wrapper only handles layout, not validation state.",
                control: <Input.TextArea id="form-note" rows={3} placeholder="Internal note..." />,
              },
            ]}
          />
        </DemoRow>
        <DemoRow label="Status">
          <div className="w-full max-w-sm">
            <FormItem
              label="Username"
              required
              htmlFor="form-username"
              validateStatus="error"
              errors={[{ message: "Username is required" }]}
            >
              <Input id="form-username" status="error" placeholder="Enter username" />
            </FormItem>
          </div>
          <div className="w-full max-w-sm">
            <FormItem
              label="Website"
              htmlFor="form-website"
              help="Optional public profile URL"
            >
              <Input id="form-website" addonBefore="https://" placeholder="example.com" />
            </FormItem>
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="attachment" title="Attachment" description="File selection and attachment list.">
        <DemoRow label="Basic / drag">
          <div className="w-80">
            <AttachmentUpload
              multiple
              accept=".pdf,.png,.jpg"
              defaultFileList={initialAttachmentFiles}
              maxCount={3}
            />
          </div>
          <div className="w-80">
            <AttachmentUpload
              drag
              multiple
              accept="image/*,.pdf"
              maxCount={4}
              emptyText="Drop or choose files to preview the list"
            />
          </div>
        </DemoRow>
        <DemoRow label="Controlled">
          <div className="w-96">
            <AttachmentUpload
              fileList={attachmentFiles}
              onChange={({ fileList }) => setAttachmentFiles(fileList)}
              onRemove={(file) => file.name !== "locked-contract.pdf"}
              beforeUpload={(file) => file.size < 1024 * 1024}
              multiple
              maxCount={3}
              trigger={<Button variant="filled">Add attachment</Button>}
              emptyText="No controlled files"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Files larger than 1 MB are ignored. The list is controlled by state.
            </p>
          </div>
        </DemoRow>
      </GallerySection>
    </SectionGroup>
  );
}

function ControlledAutoComplete() {
  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState<string | undefined>();
  const allOptions = [
    { label: "Beijing", value: "beijing" },
    { label: "Shanghai", value: "shanghai" },
    { label: "Shenzhen", value: "shenzhen" },
    { label: "Hangzhou", value: "hangzhou" },
    { label: "Chengdu", value: "chengdu" },
  ];
  const filtered = keyword
    ? allOptions.filter((option) =>
        option.label.toLowerCase().includes(keyword.toLowerCase()),
      )
    : allOptions;

  return (
    <div className="w-56 space-y-1">
      <div className="flex items-center gap-2">
        <AutoComplete
          placeholder="Search city..."
          allowClear
          value={value}
          onValueChange={setValue}
          onSearch={setKeyword}
          options={filtered}
          filterOption={false}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {keyword ? `Searching: "${keyword}"` : "Type to search"}
        {value && ` — Selected: ${value}`}
      </p>
    </div>
  );
}
