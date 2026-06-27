import { GallerySection, DemoRow } from "../gallery-section";
import { FloatButton, FloatButtonGroup } from "@/components/base/float-button";
import { Tour, type TourStepConfig } from "@/components/composite/tour";
import { Plus, MessageCircle, Share, CreditCard as Edit, Settings, ArrowUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/base/button";

export function UtilitySection() {
  const [tourOpen, setTourOpen] = useState(false);

  const tourSteps: TourStepConfig[] = [
    { title: "Welcome to the Gallery!", description: "This tour walks you through the component showcase.", placement: "center" },
    { title: "Browse Components", description: "Use the left sidebar to navigate between component categories.", placement: "center" },
    { title: "Dark Mode", description: "Toggle light/dark mode with the button in the top right.", placement: "center" },
    { title: "That's it!", description: "Explore the components and have fun.", placement: "center" },
  ];

  return (
    <>
      <GallerySection id="float-button" title="Float Button" description="Floating action buttons anchored to the viewport.">
        <DemoRow>
          <div className="rounded-lg border bg-muted/20 w-full max-w-sm h-48 relative overflow-hidden flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Float buttons appear at the bottom-right</p>
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
              <FloatButton type="primary" icon={<ArrowUp className="size-4" />} tooltip="Back to top" shape="circle" />
              <FloatButton icon={<Settings className="size-4" />} tooltip="Settings" shape="circle" />
            </div>
          </div>
          <div className="rounded-lg border bg-muted/20 w-56 h-48 relative overflow-hidden flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center px-4">Group with trigger</p>
            <div className="absolute bottom-4 right-4">
              <FloatButtonGroup trigger="click" triggerIcon={<Plus className="size-5" />}>
                <FloatButton icon={<MessageCircle className="size-4" />} tooltip="Message" shape="circle" />
                <FloatButton icon={<Share className="size-4" />} tooltip="Share" shape="circle" />
                <FloatButton icon={<Edit className="size-4" />} tooltip="Edit" shape="circle" />
              </FloatButtonGroup>
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
    </>
  );
}
