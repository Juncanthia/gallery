import { useState } from "react";
import { GallerySection, DemoRow, SectionGroup } from "../gallery-section";
import { Input } from "@/components/base/input";
import { Textarea } from "@/components/base/textarea";
import { Label } from "@/components/base/label";
import { Checkbox } from "@/components/base/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/base/radio-group";
import { Switch } from "@/components/base/switch";
import { Slider } from "@/components/base/slider";
import {
  Select, SelectTrigger, SelectValue, SelectContent,
  SelectItem, SelectLabel, SelectGroup,
} from "@/components/base/select";
import { Toggle } from "@/components/base/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/base/toggle-group";
import { InputNumber } from "@/components/base/input-number";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/base/input-otp";
import { Bold, Italic, Underline, ChevronLeft as AlignLeft, TextAlignCenter as AlignCenter, Highlighter as AlignRight } from "lucide-react";


export function FormsSection() {
  const [sliderVal, setSliderVal] = useState([40]);
  const [radioVal, setRadioVal] = useState("option-1");
  const [switchOn, setSwitchOn] = useState(false);
  const [numVal, setNumVal] = useState(10);
  const [otp, setOtp] = useState("");

  return (
    <SectionGroup title="Forms" description="Input controls, selection, and data entry components.">
      <GallerySection id="input" title="Input" description="Single-line text fields.">
        <DemoRow label="Variants">
          <div className="flex flex-col gap-2 w-56">
            <Label htmlFor="demo-input">Default</Label>
            <Input id="demo-input" placeholder="Enter text..." />
          </div>
          <div className="flex flex-col gap-2 w-56">
            <Label htmlFor="demo-email">Email</Label>
            <Input id="demo-email" type="email" placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-2 w-56">
            <Label htmlFor="demo-password">Password</Label>
            <Input id="demo-password" type="password" placeholder="••••••••" />
          </div>
          <div className="flex flex-col gap-2 w-56">
            <Label htmlFor="demo-disabled">Disabled</Label>
            <Input id="demo-disabled" disabled placeholder="Disabled..." />
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="textarea" title="Textarea" description="Multi-line text input.">
        <DemoRow label="Variants">
          <div className="flex flex-col gap-2 w-64">
            <Label htmlFor="ta1">Message</Label>
            <Textarea id="ta1" placeholder="Write your message here..." rows={3} />
          </div>
          <div className="flex flex-col gap-2 w-64">
            <Label htmlFor="ta2">Disabled</Label>
            <Textarea id="ta2" disabled placeholder="Disabled..." rows={3} />
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="select" title="Select" description="Dropdown option selection.">
        <DemoRow label="Sizes">
          <div className="flex flex-col gap-2 w-48">
            <Label>Framework</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Frontend</SelectLabel>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Backend</SelectLabel>
                  <SelectItem value="node">Node.js</SelectItem>
                  <SelectItem value="deno">Deno</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 w-48">
            <Label>Small size</Label>
            <Select>
              <SelectTrigger size="sm"><SelectValue placeholder="Small..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Option A</SelectItem>
                <SelectItem value="b">Option B</SelectItem>
                <SelectItem value="c" disabled>Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="checkbox" title="Checkbox" description="Binary checked state.">
        <DemoRow label="States">
          <div className="flex items-center gap-2"><Checkbox id="cb1" /><Label htmlFor="cb1">Default</Label></div>
          <div className="flex items-center gap-2"><Checkbox id="cb2" defaultChecked /><Label htmlFor="cb2">Checked</Label></div>
          <div className="flex items-center gap-2"><Checkbox id="cb3" checked="indeterminate" /><Label htmlFor="cb3">Indeterminate</Label></div>
          <div className="flex items-center gap-2"><Checkbox id="cb4" disabled /><Label htmlFor="cb4" className="text-muted-foreground">Disabled</Label></div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="radio" title="Radio Group" description="Single selection from a list.">
        <DemoRow label="Options">
          <RadioGroup value={radioVal} onValueChange={setRadioVal} className="gap-3">
            <div className="flex items-center gap-2"><RadioGroupItem value="option-1" id="r1" /><Label htmlFor="r1">Option One</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="option-2" id="r2" /><Label htmlFor="r2">Option Two</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="option-3" id="r3" /><Label htmlFor="r3">Option Three</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="option-4" id="r4" disabled /><Label htmlFor="r4" className="text-muted-foreground">Disabled</Label></div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground self-end">Selected: <strong>{radioVal}</strong></p>
        </DemoRow>
      </GallerySection>

      <GallerySection id="switch" title="Switch" description="Toggle between two states.">
        <DemoRow label="States">
          <div className="flex items-center gap-3"><Switch checked={switchOn} onCheckedChange={setSwitchOn} /><Label>{switchOn ? "On" : "Off"}</Label></div>
          <div className="flex items-center gap-3"><Switch defaultChecked /><Label>Default on</Label></div>
          <div className="flex items-center gap-3"><Switch disabled /><Label className="text-muted-foreground">Disabled</Label></div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="slider" title="Slider" description="Range and value selection.">
        <DemoRow label="Variants">
          <div className="space-y-3 w-64">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Value</span><span className="tabular-nums">{sliderVal[0]}</span>
            </div>
            <Slider value={sliderVal} onValueChange={setSliderVal} min={0} max={100} />
          </div>
          <div className="space-y-2 w-64">
            <p className="text-xs text-muted-foreground">Range (two thumbs)</p>
            <Slider defaultValue={[20, 80]} min={0} max={100} />
          </div>
          <div className="space-y-2 w-64">
            <p className="text-xs text-muted-foreground">Step = 10</p>
            <Slider defaultValue={[50]} min={0} max={100} step={10} />
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
          <ToggleGroup type="single" defaultValue="left">
            <ToggleGroupItem value="left" aria-label="Left"><AlignLeft className="size-4" /></ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Center"><AlignCenter className="size-4" /></ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Right"><AlignRight className="size-4" /></ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup type="multiple" variant="outline">
            <ToggleGroupItem value="bold"><Bold className="size-4" /></ToggleGroupItem>
            <ToggleGroupItem value="italic"><Italic className="size-4" /></ToggleGroupItem>
            <ToggleGroupItem value="underline"><Underline className="size-4" /></ToggleGroupItem>
          </ToggleGroup>
        </DemoRow>
      </GallerySection>

      <GallerySection id="input-number" title="InputNumber" description="Numeric input with step controls.">
        <DemoRow label="Variants">
          <div className="flex flex-col gap-2">
            <Label>Quantity</Label>
            <InputNumber value={numVal} onChange={(v) => setNumVal(v ?? 0)} min={0} max={100} className="w-32" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Price</Label>
            <InputNumber defaultValue={9.99} step={0.01} precision={2} prefix="$" className="w-36" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>No controls</Label>
            <InputNumber defaultValue={42} controls={false} className="w-28" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>With suffix</Label>
            <InputNumber defaultValue={75} suffix="%" min={0} max={100} className="w-32" />
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="input-otp" title="InputOTP" description="One-time password input.">
        <DemoRow label="Lengths">
          <div className="flex flex-col gap-2">
            <Label>6-digit OTP</Label>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {otp.length === 6 && <p className="text-xs text-muted-foreground">Entered: <strong>{otp}</strong></p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label>4-digit PIN</Label>
            <InputOTP maxLength={4}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </DemoRow>
      </GallerySection>
    </SectionGroup>
  );
}
