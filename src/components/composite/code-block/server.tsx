import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import type { HTMLAttributes } from "react";
import {
  type BundledLanguage,
  type CodeOptionsMultipleThemes,
  codeToHtml,
} from "shiki";
import { createCssVariablesTheme } from "shiki/core";

const cssVariablesTheme = createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
});

export type CodeBlockContentProps = HTMLAttributes<HTMLDivElement> & {
  themes?: CodeOptionsMultipleThemes["themes"];
  language?: BundledLanguage;
  children: string;
  syntaxHighlighting?: boolean;
};

export const CodeBlockContent = async ({
  children,
  themes: _themes,
  language,
  syntaxHighlighting = true,
  ...props
}: CodeBlockContentProps) => {
  void _themes;
  const html = syntaxHighlighting
    ? await codeToHtml(children as string, {
        lang: language ?? "typescript",
        theme: cssVariablesTheme,
        transformers: [
          transformerNotationDiff({
            matchAlgorithm: "v3",
          }),
          transformerNotationHighlight({
            matchAlgorithm: "v3",
          }),
          transformerNotationWordHighlight({
            matchAlgorithm: "v3",
          }),
          transformerNotationFocus({
            matchAlgorithm: "v3",
          }),
          transformerNotationErrorLevel({
            matchAlgorithm: "v3",
          }),
        ],
      })
    : children;

  return (
    <div
      // biome-ignore lint/security/noDangerouslySetInnerHtml: "Kinda how Shiki works"
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
};
