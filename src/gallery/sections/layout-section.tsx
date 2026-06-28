import { useState } from "react";
import { GallerySection, DemoRow, SectionGroup } from "../gallery-section";
import { Button } from "@/components/base/button";
import { Badge } from "@/components/base/badge";
import { Flex } from "@/components/base/flex";
import { Space } from "@/components/base/space";
import { Watermark } from "@/components/base/watermark";
import { Affix } from "@/components/base/affix";
import { ScrollArea } from "@/components/base/scroll-area";
import { AspectRatio } from "@/components/base/aspect-ratio";
import { Calendar } from "@/components/base/calendar";
import { Resizable } from "@/components/base/resizable";
import { Carousel } from "@/components/base/carousel";
import { Card, CardContent } from "@/components/base/card";
import { type DateRange } from "react-day-picker";

export function LayoutSection() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [affixed, setAffixed] = useState(false);

  return (
    <SectionGroup title="Layout & Misc" description="Structural layout utilities, containers, and miscellaneous components.">
      <GallerySection id="flex" title="Flex" description="Flexbox layout utility.">
        <DemoRow label="justify variants">
          {(["start", "center", "end", "between"] as const).map((j) => (
            <div key={j} className="w-48 rounded-md border overflow-hidden">
              <p className="text-xs text-muted-foreground px-2 py-1 border-b bg-muted/50">{j}</p>
              <Flex justify={j} className="p-2" gap={1}>
                <Badge variant="secondary">A</Badge>
                <Badge variant="secondary">B</Badge>
                <Badge variant="secondary">C</Badge>
              </Flex>
            </div>
          ))}
        </DemoRow>
        <DemoRow label="API">
          <div className="w-48 rounded-md border overflow-hidden">
            <p className="text-xs text-muted-foreground px-2 py-1 border-b bg-muted/50">vertical / center</p>
            <Flex vertical align="center" className="p-3" gap="small">
              <Badge>First</Badge>
              <Badge variant="secondary">Second</Badge>
              <Badge variant="outline">Third</Badge>
            </Flex>
          </div>
          <div className="w-48 rounded-md border overflow-hidden">
            <p className="text-xs text-muted-foreground px-2 py-1 border-b bg-muted/50">wrap + number gap</p>
            <Flex wrap className="p-2" gap={8}>
              {Array.from({ length: 6 }, (_, i) => (
                <Badge key={i} variant="secondary">Item {i + 1}</Badge>
              ))}
            </Flex>
          </div>
          <Flex as="section" flex="1" align="center" gap="middle" className="rounded-md border p-2">
            <Badge>as=section</Badge>
            <span className="text-sm text-muted-foreground">custom flex style</span>
          </Flex>
        </DemoRow>
      </GallerySection>

      <GallerySection id="space" title="Space" description="Uniform spacing between children.">
        <DemoRow label="Horizontal">
          <Space size="middle" wrap>
            <Badge>Item 1</Badge>
            <Badge variant="secondary">Item 2</Badge>
            <Badge variant="outline">Item 3</Badge>
          </Space>
          <Space size={[8, 16]} separator={<span>/</span>}>
            <Button size="small" variant="text">Edit</Button>
            <Button size="small" variant="text">Copy</Button>
            <Button size="small" variant="text">Delete</Button>
          </Space>
        </DemoRow>
        <DemoRow label="Vertical with separator">
          <Space vertical size={12} separator={<hr className="w-full border-border" />} className="w-40">
            <p className="text-sm">First item</p>
            <p className="text-sm">Second item</p>
            <p className="text-sm">Third item</p>
          </Space>
        </DemoRow>
      </GallerySection>

      <GallerySection id="resizable" title="Resizable" description="Drag-to-resize panel groups.">
        <DemoRow label="Items API">
          <div className="w-full max-w-xl overflow-hidden rounded border" style={{ height: 160 }}>
            <Resizable
              orientation="horizontal"
              items={[
                {
                  defaultSize: 45,
                  content: (
                    <div className="flex h-full items-center justify-center p-4 text-sm font-medium">
                      Left Panel
                    </div>
                  ),
                },
                {
                  defaultSize: 55,
                  content: (
                    <Resizable
                      orientation="vertical"
                      items={[
                        {
                          defaultSize: 50,
                          content: (
                            <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                              Top Right
                            </div>
                          ),
                        },
                        {
                          defaultSize: 50,
                          content: (
                            <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                              Bottom Right
                            </div>
                          ),
                        },
                      ]}
                    />
                  ),
                },
              ]}
            />
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="scroll-area" title="Scroll Area" description="Custom scrollable container.">
        <DemoRow>
          <ScrollArea className="h-48 w-64 rounded-md border">
            <div className="p-4 space-y-3">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="size-6 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </div>
                  <span className="text-muted-foreground">Scroll item {i + 1}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          <ScrollArea className="h-48 w-64 rounded-md border">
            <div className="flex gap-3 p-4 w-max">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="size-16 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center text-xs font-medium">
                  {i + 1}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DemoRow>
      </GallerySection>

      <GallerySection id="aspect-ratio" title="Aspect Ratio" description="Maintain consistent width/height ratio.">
        <DemoRow>
          <div className="w-64">
            <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden bg-muted">
              <img
                src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?w=400"
                alt="Landscape"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <p className="text-xs text-muted-foreground mt-1 text-center">16:9</p>
          </div>
          <div className="w-40">
            <AspectRatio ratio={1} className="rounded-lg overflow-hidden bg-muted">
              <img
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=200"
                alt="Portrait"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <p className="text-xs text-muted-foreground mt-1 text-center">1:1</p>
          </div>
          <div className="w-48">
            <AspectRatio ratio={4 / 3} className="rounded-lg overflow-hidden bg-muted">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300"
                alt="Food"
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <p className="text-xs text-muted-foreground mt-1 text-center">4:3</p>
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="calendar" title="Calendar" description="Date and date range picker.">
        <DemoRow label="AntD-like API">
          <Calendar
            value={calendarValue}
            onChange={setCalendarValue}
            validRange={[new Date(2024, 0, 1), new Date(2026, 11, 31)]}
            dateCellRender={(current) => current.getDate() === calendarValue.getDate() ? <span>selected</span> : null}
            headerRender={({ value }) => (
              <div className="px-3 pt-3 text-sm font-medium">
                {value.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </div>
            )}
          />
        </DemoRow>
        <DemoRow label="DayPicker compatibility">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
          />
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </DemoRow>
      </GallerySection>

      <GallerySection id="carousel" title="Carousel" description="Slidable content carousel.">
        <DemoRow label="Items API">
          <div className="w-full max-w-sm">
            <Carousel
              items={Array.from({ length: 5 }, (_, i) => ({
                content: (
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold text-muted-foreground">{i + 1}</span>
                    </CardContent>
                  </Card>
                ),
              }))}
            />
          </div>
        </DemoRow>
        <DemoRow label="Multiple visible">
          <div className="w-full max-w-xl">
            <Carousel
              opts={{ align: "start" }}
              contentClassName="-ml-2"
              itemClassName="basis-1/3 pl-2"
              items={Array.from({ length: 8 }, (_, i) => ({
                content: (
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-4">
                        <span className="text-2xl font-semibold text-muted-foreground">{i + 1}</span>
                      </CardContent>
                    </Card>
                ),
              }))}
            />
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="watermark" title="Watermark" description="Canvas-rendered repeating overlay.">
        <DemoRow>
          <div className="relative w-72 h-36 rounded-lg border overflow-hidden bg-card flex items-center justify-center">
            <Watermark content="Confidential" gap={[60, 40]}>
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm font-medium">Protected Content</p>
                <p className="text-xs text-muted-foreground">Single line watermark</p>
              </div>
            </Watermark>
          </div>
          <div className="relative w-72 h-36 rounded-lg border overflow-hidden bg-card flex items-center justify-center">
            <Watermark
              content={[{ text: "Acme Corp", font: { fontWeight: 700 } }, "Internal Use"]}
              rotate={-30}
              gap={[80, 50]}
              font={{ color: "rgba(37,99,235,0.16)", fontSize: 14 }}
            >
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm font-medium">Multi-line Watermark</p>
                <p className="text-xs text-muted-foreground">Two text lines</p>
              </div>
            </Watermark>
          </div>
        </DemoRow>
      </GallerySection>

      <GallerySection id="affix" title="Affix" description="Element that sticks when scrolling past an offset.">
        <DemoRow>
          <div className="rounded-lg border p-4 bg-muted/20 max-w-sm">
            <p className="text-sm text-muted-foreground mb-3">
              Affix pins an element to the viewport once the user scrolls past a threshold. Used for sticky toolbars, back-to-top buttons, or sidebars.
            </p>
            <Affix offsetTop={80} onChange={setAffixed}>
              <Button size="small" variant={affixed ? "solid" : "outlined"}>
                {affixed ? "Affixed" : "Sticky at 80px from top"}
              </Button>
            </Affix>
          </div>
        </DemoRow>
      </GallerySection>
    </SectionGroup>
  );
}
