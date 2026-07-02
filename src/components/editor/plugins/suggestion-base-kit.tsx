import type {
  TElement,
  TInlineSuggestionData,
  TSuggestionData,
  TSuggestionText,
} from 'platejs';
import { KEYS, TextApi } from 'platejs';
import { BaseSuggestionPlugin } from '@platejs/suggestion';
import type { PlateEditor } from 'platejs/react';

import {
  SuggestionLeafStatic,
  VoidRemoveSuggestionOverlayStatic,
} from '@/components/editor/nodes/suggestion-node-static';

const INLINE_SUGGESTION_TARGET_PLUGINS = [
  KEYS.date,
  KEYS.inlineEquation,
  KEYS.link,
  KEYS.mention,
];

function getInlineSuggestionData(editor: PlateEditor, element: TElement) {
  const suggestionApi = editor.getApi(BaseSuggestionPlugin).suggestion;
  const data = suggestionApi.suggestionData(element) as
    | TSuggestionData
    | TInlineSuggestionData
    | undefined;

  if (data) return data;
  if (typeof suggestionApi.dataList !== 'function') return;

  for (const child of element.children) {
    if (!TextApi.isText(child)) continue;

    const childData = suggestionApi.dataList(child as TSuggestionText).at(-1);

    if (childData) return childData;
  }
}

export const BaseSuggestionKit = [
  BaseSuggestionPlugin.configure({
    inject: {
      isElement: true,
      nodeProps: {
        nodeKey: '',
        styleKey: 'cssText',
        transformProps: ({ editor, element, props }) => {
          if (!element) return props;

          const suggestionData = getInlineSuggestionData(editor, element);

          if (!suggestionData) return props;

          return {
            ...props,
            'data-inline-suggestion': suggestionData.type,
          };
        },
        transformStyle: () => ({}) as CSSStyleDeclaration,
      },
      targetPlugins: INLINE_SUGGESTION_TARGET_PLUGINS,
    },
    render: {
      belowRootNodes: VoidRemoveSuggestionOverlayStatic as never,
      node: SuggestionLeafStatic as never,
    },
  }),
];
