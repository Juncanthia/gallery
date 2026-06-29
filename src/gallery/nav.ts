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
    group: "Components",
    items: [
      { id: "button", label: "Button" },
    ],
  },
];
