import { useState } from "react";
import { GallerySection, DemoRow, SectionGroup } from "../gallery-section";
import { FloatButton, FloatButtonBackTop, FloatButtonGroup } from "@/components/base/float-button";
import { Tour, type TourStepConfig } from "@/components/composite/tour";
import { Plus, MessageCircle, Share, CreditCard as Edit, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/base/button";
import { message } from "@/components/base/message-api";

export function UtilitySection() {
  const [tourOpen, setTourOpen] = useState(false);

  const tourSteps: TourStepConfig[] = [
    { title: "Welcome to the Gallery!", description: "This tour walks you through the component showcase.", placement: "center" },
    { title: "Browse Components", description: "Use the left sidebar to navigate between component categories.", placement: "center" },
    { title: "Dark Mode", description: "Toggle light/dark mode with the button in the top right.", placement: "center" },
    { title: "That's it!", description: "Explore the components and have fun.", placement: "center" },
  ];

  return (
    <SectionGroup title="Utility" description="Floating actions and guided product utilities.">
      <GallerySection id="message" title="Message" description="Global feedback messages with API-first calls.">
        <DemoRow label="Types">
          <Button onClick={() => message.success("Saved successfully")}>Success</Button>
          <Button onClick={() => message.info("New update available")}>Info</Button>
          <Button onClick={() => message.warning("Please check the form")}>Warning</Button>
          <Button onClick={() => message.error("Something went wrong")}>Error</Button>
        </DemoRow>
        <DemoRow label="Key / loading">
          <Button
            onClick={() => {
              const key = "message-save";
              message.loading({ key, content: "Saving...", duration: 0 });
              window.setTimeout(() => {
                message.success({ key, content: "Saved", duration: 2 });
              }, 1000);
            }}
          >
            Update by key
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              message.open({
                type: "info",
                content: "Custom duration",
                duration: 5,
              })
            }
          >
            Open config
          </Button>
          <Button variant="text" onClick={() => message.destroy()}>
            Destroy all
          </Button>
        </DemoRow>
      </GallerySection>

      <GallerySection id="float-button" title="Float Button" description="Floating action buttons anchored to a surface or viewport.">
        <DemoRow label="API">
          <div className="relative flex h-52 w-full max-w-sm items-center justify-center overflow-hidden rounded border bg-muted/20">
            <p className="text-sm text-muted-foreground">Float buttons appear at the bottom-right</p>
            <div className="absolute right-4 bottom-4 flex flex-col items-end gap-2">
              <FloatButtonBackTop visibilityHeight={0} type="primary" />
              <FloatButton icon={<Settings className="size-4" />} tooltip={{ title: "Settings", placement: "left" }} badge={{ dot: true }} />
              <FloatButton shape="square" icon={<HelpCircle className="size-4" />} content="Help" tooltip="Help center" />
            </div>
          </div>
          <div className="relative flex h-52 w-64 items-center justify-center overflow-hidden rounded border bg-muted/20">
            <p className="px-4 text-center text-sm text-muted-foreground">Group with trigger</p>
            <div className="absolute right-4 bottom-4">
              <FloatButtonGroup
                trigger="click"
                placement="top"
                triggerIcon={<Plus className="size-5" />}
                items={[
                  { key: "message", icon: <MessageCircle className="size-4" />, tooltip: "Message" },
                  { key: "share", icon: <Share className="size-4" />, tooltip: "Share", badge: 2 },
                  { key: "edit", icon: <Edit className="size-4" />, tooltip: { title: "Edit", placement: "left" } },
                ]}
              />
            </div>
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="tour-demo" title="Tour" description="Step-by-step guided product tours.">
        <DemoRow>
          <div className="space-y-2">
            <Button onClick={() => setTourOpen(true)}>Start Guided Tour</Button>
            <p className="text-xs text-muted-foreground">4-step tour with center placement</p>
          </div>
          <Tour
            open={tourOpen}
            onClose={() => setTourOpen(false)}
            steps={tourSteps}
          />
        </DemoRow>
      </GallerySection>
    </SectionGroup>
  );
}
