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
      { id: "tag", label: "Tag" },
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
      { id: "empty", label: "Empty" },
      { id: "image", label: "Image" },
      { id: "list", label: "List" },
      { id: "qr-code", label: "QRCode" },
      { id: "file-tree", label: "File Tree" },
      { id: "tree", label: "Tree" },
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
      { id: "rate", label: "Rate" },
      { id: "date-picker", label: "DatePicker" },
      { id: "time-picker", label: "TimePicker" },
      { id: "color-picker", label: "ColorPicker" },
      { id: "mentions", label: "Mentions" },
      { id: "tree-select", label: "TreeSelect" },
      { id: "transfer", label: "Transfer" },
      { id: "input-number", label: "Input.Number" },
      { id: "input-otp", label: "Input.OTP" },
      { id: "auto-complete", label: "AutoComplete" },
      { id: "form", label: "Form" },
      { id: "attachment", label: "Attachment" },
    ],
  },
  {
    group: "Navigation",
    items: [
      { id: "tabs", label: "Tabs" },
      { id: "menubar", label: "Menubar" },
      { id: "navigation-menu", label: "Navigation Menu" },
      { id: "accordion", label: "Accordion" },
      { id: "breadcrumb", label: "Breadcrumb" },
      { id: "pagination", label: "Pagination" },
      { id: "anchor", label: "Anchor" },
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
      { id: "message", label: "Message" },
      { id: "notification", label: "Notification" },
      { id: "popconfirm", label: "Popconfirm" },
      { id: "progress", label: "Progress" },
      { id: "spin", label: "Spin" },
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
  {
    group: "Utility",
    items: [
      { id: "float-button", label: "Float Button" },
      { id: "tour-demo", label: "Tour" },
    ],
  },
];
