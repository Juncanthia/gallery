export type NavItem = {
  id: string;
  label: string;
};

export type NavGroup = {
  group: string;
  items: NavItem[];
};

export const NAV: NavGroup[] = [
  {
    group: "General",
    items: [
      { id: "button", label: "Button" },
      { id: "badge", label: "Badge" },
      { id: "avatar", label: "Avatar" },
      { id: "kbd", label: "Kbd" },
      { id: "separator", label: "Separator" },
    ],
  },
  {
    group: "Typography",
    items: [
      { id: "typography", label: "Typography" },
      { id: "statistic", label: "Statistic" },
    ],
  },
  {
    group: "Data Display",
    items: [
      { id: "alert", label: "Alert" },
      { id: "card", label: "Card" },
      { id: "skeleton", label: "Skeleton" },
      { id: "descriptions", label: "Descriptions" },
      { id: "timeline", label: "Timeline" },
      { id: "steps", label: "Steps" },
      { id: "result", label: "Result" },
      { id: "file-tree", label: "File Tree" },
      { id: "table", label: "Table" },
    ],
  },
  {
    group: "Forms",
    items: [
      { id: "input", label: "Input" },
      { id: "textarea", label: "Input.TextArea" },
      { id: "select", label: "Select" },
      { id: "checkbox", label: "Checkbox" },
      { id: "radio", label: "Radio Group" },
      { id: "switch", label: "Switch" },
      { id: "slider", label: "Slider" },
      { id: "toggle", label: "Toggle" },
      { id: "input-number", label: "Input.Number" },
      { id: "input-otp", label: "Input.OTP" },
    ],
  },
  {
    group: "Navigation",
    items: [
      { id: "tabs", label: "Tabs" },
      { id: "accordion", label: "Accordion" },
      { id: "breadcrumb", label: "Breadcrumb" },
      { id: "pagination", label: "Pagination" },
      { id: "collapsible", label: "Collapsible" },
    ],
  },
  {
    group: "Overlay",
    items: [
      { id: "dialog", label: "Dialog" },
      { id: "alert-dialog", label: "Alert Dialog" },
      { id: "sheet", label: "Sheet" },
      { id: "drawer", label: "Drawer" },
      { id: "dropdown", label: "Dropdown Menu" },
      { id: "context-menu", label: "Context Menu" },
      { id: "popover", label: "Popover" },
      { id: "tooltip", label: "Tooltip" },
      { id: "hover-card", label: "Hover Card" },
    ],
  },
  {
    group: "Feedback",
    items: [
      { id: "progress", label: "Progress" },
      { id: "alert-component", label: "Alert" },
    ],
  },
  {
    group: "Layout",
    items: [
      { id: "flex", label: "Flex" },
      { id: "space", label: "Space" },
      { id: "resizable", label: "Resizable" },
      { id: "scroll-area", label: "Scroll Area" },
      { id: "aspect-ratio", label: "Aspect Ratio" },
    ],
  },
  {
    group: "Misc",
    items: [
      { id: "border-beam", label: "Border Beam" },
      { id: "watermark", label: "Watermark" },
      { id: "affix", label: "Affix" },
      { id: "calendar", label: "Calendar" },
      { id: "carousel", label: "Carousel" },
    ],
  },
];
