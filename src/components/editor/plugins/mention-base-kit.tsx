import { BaseMentionPlugin } from '@platejs/mention';

import { MentionElementStatic } from '@/components/editor/nodes/mention-node-static';

export const BaseMentionKit = [
  BaseMentionPlugin.withComponent(MentionElementStatic),
];
