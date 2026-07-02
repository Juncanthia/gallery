import { BaseTogglePlugin } from '@platejs/toggle';

import { ToggleElementStatic } from '@/components/editor/nodes/toggle-node-static';

export const BaseToggleKit = [
  BaseTogglePlugin.withComponent(ToggleElementStatic),
];
