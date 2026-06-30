import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogImage,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
  MorphingDialogClose,
} from "@/components/ui/gooseui-morphing-dialog"

export default function Demo() {
  return (
    <div className="flex items-center justify-center p-12">
      <MorphingDialog>
        <MorphingDialogTrigger>
          <div className="overflow-hidden rounded-xl border bg-card shadow">
            <MorphingDialogImage
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
              alt="Mountain landscape"
              className="h-48 w-72"
            />
            <div className="p-4">
              <h3 className="font-semibold">Mountain Vista</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Click to expand
              </p>
            </div>
          </div>
        </MorphingDialogTrigger>
        <MorphingDialogContainer>
          <MorphingDialogContent className="p-0">
            <MorphingDialogClose />
            <MorphingDialogImage
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop"
              alt="Mountain landscape"
              className="h-64 w-full rounded-t-xl"
            />
            <div className="p-6">
              <MorphingDialogTitle>Mountain Vista</MorphingDialogTitle>
              <MorphingDialogSubtitle>
                A breathtaking view of alpine peaks
              </MorphingDialogSubtitle>
              <MorphingDialogDescription>
                Experience the serene beauty of snow-capped mountains
                reflected in crystal-clear alpine waters. This stunning
                landscape showcases nature at its finest, with towering
                peaks reaching toward an endless blue sky.
              </MorphingDialogDescription>
            </div>
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>
    </div>
  )
}
