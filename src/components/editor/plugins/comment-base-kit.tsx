import { BaseCommentPlugin } from '@platejs/comment';

import { CommentLeafStatic } from '@/components/editor/nodes/comment-node-static';

export const BaseCommentKit = [
  BaseCommentPlugin.withComponent(CommentLeafStatic),
];
