'use client';

import emojiMartData from '@emoji-mart/data';
import { EmojiInputPlugin, EmojiPlugin } from '@platejs/emoji/react';

import { EmojiInputElement } from '@/components/editor/nodes/emoji-node';

export const EmojiKit = [
  EmojiPlugin.configure({
    options: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- emoji-mart data shape is runtime-validated
      data: emojiMartData as any,
    },
  }),
  EmojiInputPlugin.withComponent(EmojiInputElement),
];
