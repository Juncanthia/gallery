'use client';

import { createPlatePlugin } from 'platejs/react';

import { FixedToolbar } from '@/components/editor/toolbars/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/editor/toolbars/fixed-toolbar-buttons';

export const FixedToolbarKit = [
  createPlatePlugin({
    key: 'fixed-toolbar',
    render: {
      beforeEditable: () => (
        <FixedToolbar>
          <FixedToolbarButtons />
        </FixedToolbar>
      ),
    },
  }),
];
