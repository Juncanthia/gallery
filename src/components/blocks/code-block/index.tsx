"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import type {
  ComponentProps,
  HTMLAttributes,
  ReactNode,
} from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { CopyButton } from "@/components/core/copy-button";
import type { IconType } from "react-icons";
import {
  SiAstro,
  SiBiome,
  SiBower,
  SiBun,
  SiC,
  SiCircleci,
  SiCoffeescript,
  SiCplusplus,
  SiCss,
  SiCssmodules,
  SiDart,
  SiDocker,
  SiDocusaurus,
  SiDotenv,
  SiEditorconfig,
  SiEslint,
  SiGatsby,
  SiGitignoredotio,
  SiGnubash,
  SiGo,
  SiGraphql,
  SiGrunt,
  SiGulp,
  SiHandlebarsdotjs,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiJson,
  SiLess,
  SiMarkdown,
  SiMdx,
  SiMintlify,
  SiMocha,
  SiMysql,
  SiNextdotjs,
  SiPerl,
  SiPhp,
  SiPostcss,
  SiPrettier,
  SiPrisma,
  SiPug,
  SiPython,
  SiR,
  SiReact,
  SiReadme,
  SiRedis,
  SiRemix,
  SiRive,
  SiRollupdotjs,
  SiRuby,
  SiSanity,
  SiSass,
  SiScala,
  SiSentry,
  SiShadcnui,
  SiStorybook,
  SiStylelint,
  SiSublimetext,
  SiSvelte,
  SiSvg,
  SiSwift,
  SiTailwindcss,
  SiToml,
  SiTypescript,
  SiVercel,
  SiVite,
  SiVuedotjs,
  SiWebassembly,
} from "react-icons/si";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/core/select";
import { cn } from "@/lib/utils";

export type { BundledLanguage } from "shiki";

const filenameIconMap = {
  ".env": SiDotenv,
  "*.astro": SiAstro,
  "biome.json": SiBiome,
  ".bowerrc": SiBower,
  "bun.lockb": SiBun,
  "*.c": SiC,
  "*.cpp": SiCplusplus,
  ".circleci/config.yml": SiCircleci,
  "*.coffee": SiCoffeescript,
  "*.module.css": SiCssmodules,
  "*.css": SiCss,
  "*.dart": SiDart,
  Dockerfile: SiDocker,
  "docusaurus.config.js": SiDocusaurus,
  ".editorconfig": SiEditorconfig,
  ".eslintrc": SiEslint,
  "eslint.config.*": SiEslint,
  "gatsby-config.*": SiGatsby,
  ".gitignore": SiGitignoredotio,
  "*.go": SiGo,
  "*.graphql": SiGraphql,
  "*.sh": SiGnubash,
  "Gruntfile.*": SiGrunt,
  "gulpfile.*": SiGulp,
  "*.hbs": SiHandlebarsdotjs,
  "*.html": SiHtml5,
  "*.js": SiJavascript,
  "*.json": SiJson,
  "*.test.js": SiJest,
  "*.less": SiLess,
  "*.md": SiMarkdown,
  "*.mdx": SiMdx,
  "mintlify.json": SiMintlify,
  "mocha.opts": SiMocha,
  "*.mustache": SiHandlebarsdotjs,
  "*.sql": SiMysql,
  "next.config.*": SiNextdotjs,
  "*.pl": SiPerl,
  "*.php": SiPhp,
  "postcss.config.*": SiPostcss,
  "prettier.config.*": SiPrettier,
  "*.prisma": SiPrisma,
  "*.pug": SiPug,
  "*.py": SiPython,
  "*.r": SiR,
  "*.rb": SiRuby,
  "*.jsx": SiReact,
  "*.tsx": SiReact,
  "readme.md": SiReadme,
  "*.rdb": SiRedis,
  "remix.config.*": SiRemix,
  "*.riv": SiRive,
  "rollup.config.*": SiRollupdotjs,
  "sanity.config.*": SiSanity,
  "*.sass": SiSass,
  "*.scss": SiSass,
  "*.sc": SiScala,
  "*.scala": SiScala,
  "sentry.client.config.*": SiSentry,
  "components.json": SiShadcnui,
  "storybook.config.*": SiStorybook,
  "stylelint.config.*": SiStylelint,
  ".sublime-settings": SiSublimetext,
  "*.svelte": SiSvelte,
  "*.svg": SiSvg,
  "*.swift": SiSwift,
  "tailwind.config.*": SiTailwindcss,
  "*.toml": SiToml,
  "*.ts": SiTypescript,
  "vercel.json": SiVercel,
  "vite.config.*": SiVite,
  "*.vue": SiVuedotjs,
  "*.wasm": SiWebassembly,
};

const lineNumberClassNames = cn(
  "[&_code]:[counter-reset:line]",
  "[&_code]:[counter-increment:line_0]",
  "[&_.line]:before:content-[counter(line)]",
  "[&_.line]:before:inline-block",
  "[&_.line]:before:[counter-increment:line]",
  "[&_.line]:before:w-4",
  "[&_.line]:before:mr-4",
  "[&_.line]:before:text-[11px]",
  "[&_.line]:before:text-right",
  "[&_.line]:before:text-muted-foreground/40",
  "[&_.line]:before:select-none"
);

const darkModeClassNames = "";

const lineHighlightClassNames = cn(
  "[&_.line.highlighted]:bg-zinc-100/50",
  "[&_.line.highlighted]:after:bg-zinc-400",
  "[&_.line.highlighted]:after:absolute",
  "[&_.line.highlighted]:after:left-0",
  "[&_.line.highlighted]:after:top-0",
  "[&_.line.highlighted]:after:bottom-0",
  "[&_.line.highlighted]:after:w-0.5",
  "dark:[&_.line.highlighted]:!bg-zinc-800/50",
  "dark:[&_.line.highlighted]:after:!bg-zinc-500"
);

const lineDiffClassNames = cn(
  "[&_.line.diff]:after:absolute",
  "[&_.line.diff]:after:left-0",
  "[&_.line.diff]:after:top-0",
  "[&_.line.diff]:after:bottom-0",
  "[&_.line.diff]:after:w-0.5",
  "[&_.line.diff.add]:bg-[color-mix(in_oklch,var(--syntax-diff-add-color)_8%,transparent)]",
  "[&_.line.diff.add]:after:bg-[var(--syntax-diff-add-color)]",
  "[&_.line.diff.remove]:bg-[color-mix(in_oklch,var(--syntax-diff-remove-color)_8%,transparent)]",
  "[&_.line.diff.remove]:after:bg-[var(--syntax-diff-remove-color)]"
);

const lineFocusedClassNames = cn(
  "[&_code:has(.focused)_.line]:blur-[2px]",
  "[&_code:has(.focused)_.line.focused]:blur-none"
);

const wordHighlightClassNames = cn(
  "[&_.highlighted-word]:bg-zinc-100",
  "dark:[&_.highlighted-word]:!bg-zinc-800"
);

const codeBlockClassName = cn(
  "mt-0 bg-[var(--code-bg-color)] text-[var(--text-color)] text-[13px] leading-relaxed",
  "[&_pre]:py-4",
  "[&_.shiki]:!bg-transparent",
  "[&_code]:w-full",
  "[&_code]:grid",
  "[&_code]:overflow-x-auto",
  "[&_code]:bg-transparent",
  "[&_.line]:px-4",
  "[&_.line]:w-full",
  "[&_.line]:relative"
);

const highlight = (
  html: string,
  language?: BundledLanguage
) =>
  codeToHtml(html, {
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
  });

type CodeBlockData = {
  language: string;
  filename: string;
  code: string;
};

type CodeBlockContextType = {
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  data: CodeBlockData[];
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  value: undefined,
  onValueChange: undefined,
  data: [],
});

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  data: CodeBlockData[];
};

export const CodeBlock = ({
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue,
  className,
  data,
  style,
  ...props
}: CodeBlockProps) => {
  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue ?? "",
    prop: controlledValue,
    onChange: controlledOnValueChange,
  });

  return (
    <CodeBlockContext.Provider value={{ value, onValueChange, data }}>
      <div
        data-canthia-ignore=""
        data-slot="code-block"
        className={cn(
          "not-prose size-full overflow-hidden rounded border border-[var(--code-border-color)] bg-[var(--code-bg-color)] text-[var(--text-color)]",
          className
        )}
        style={style}
        {...props}
      />
    </CodeBlockContext.Provider>
  );
};

export type CodeBlockHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CodeBlockHeader = ({
  className,
  ...props
}: CodeBlockHeaderProps) => (
  <div
    className={cn(
      "flex h-9 flex-row items-center justify-between border-b border-[var(--code-border-color)] bg-muted/20 px-3 py-1.5",
      className
    )}
    {...props}
  />
);

export type CodeBlockFilesProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: (item: CodeBlockData) => ReactNode;
};

export const CodeBlockFiles = ({
  className,
  children,
  ...props
}: CodeBlockFilesProps) => {
  const { data } = useContext(CodeBlockContext);

  return (
    <div
      className={cn("flex grow flex-row items-center gap-2", className)}
      {...props}
    >
      {data.map(children)}
    </div>
  );
};

export type CodeBlockFilenameProps = HTMLAttributes<HTMLDivElement> & {
  icon?: IconType;
  value?: string;
};

export const CodeBlockFilename = ({
  className,
  icon,
  value,
  children,
  ...props
}: CodeBlockFilenameProps) => {
  const { value: activeValue } = useContext(CodeBlockContext);
  const defaultIcon = Object.entries(filenameIconMap).find(([pattern]) => {
    const regex = new RegExp(
      `^${pattern.replace(/\\/g, "\\\\").replace(/\./g, "\\.").replace(/\*/g, ".*")}$`
    );
    return regex.test(children as string);
  })?.[1];
  const Icon = icon ?? defaultIcon;

  if (value !== undefined && value !== activeValue) {
    return null;
  }

  return (
    <div
      className={cn("flex items-center gap-2 text-muted-foreground text-xs font-medium", className)}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground/80" />}
      <span className="truncate">{children}</span>
    </div>
  );
};

export type CodeBlockSelectProps = ComponentProps<typeof Select>;

export const CodeBlockSelect = (props: CodeBlockSelectProps) => {
  const { value, onValueChange } = useContext(CodeBlockContext);

  return <Select onValueChange={onValueChange} value={value} {...props} />;
};

export type CodeBlockSelectTriggerProps = ComponentProps<typeof SelectTrigger>;

export const CodeBlockSelectTrigger = ({
  className,
  ...props
}: CodeBlockSelectTriggerProps) => (
  <SelectTrigger
    className={cn(
      "w-fit border-none text-muted-foreground text-xs shadow-none",
      className
    )}
    {...props}
  />
);

export type CodeBlockSelectValueProps = ComponentProps<typeof SelectValue>;

export const CodeBlockSelectValue = (props: CodeBlockSelectValueProps) => (
  <SelectValue {...props} />
);

export type CodeBlockSelectContentProps = Omit<
  ComponentProps<typeof SelectContent>,
  "children"
> & {
  children: (item: CodeBlockData) => ReactNode;
};

export const CodeBlockSelectContent = ({
  children,
  ...props
}: CodeBlockSelectContentProps) => {
  const { data } = useContext(CodeBlockContext);

  return <SelectContent {...props}>{data.map(children)}</SelectContent>;
};

export type CodeBlockSelectItemProps = ComponentProps<typeof SelectItem>;

export const CodeBlockSelectItem = ({
  className,
  ...props
}: CodeBlockSelectItemProps) => (
  <SelectItem className={cn("text-sm", className)} {...props} />
);

export type CodeBlockCopyButtonProps = Omit<ComponentProps<typeof CopyButton>, "content"> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const CodeBlockCopyButton = ({
  onCopy,
  timeout = 2000,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const { data, value } = useContext(CodeBlockContext);
  const code = data.find((item) => item.language === value)?.code ?? "";

  return (
    <CopyButton
      className={cn("shrink-0", className)}
      content={code}
      delay={timeout}
      onCopiedChange={(copied) => {
        if (copied) onCopy?.();
      }}
      shape="square"
      variant="text"
      {...props}
    />
  );
};

type CodeBlockFallbackProps = HTMLAttributes<HTMLDivElement>;

const CodeBlockFallback = ({ children, ...props }: CodeBlockFallbackProps) => (
  <div {...props}>
    <pre className="w-full">
      <code>
        {children
          ?.toString()
          .split("\n")
          .map((line, i) => (
            <span className="line" key={i}>
              {line}
            </span>
          ))}
      </code>
    </pre>
  </div>
);

export type CodeBlockBodyProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: (item: CodeBlockData) => ReactNode;
};

export const CodeBlockBody = ({ children, ...props }: CodeBlockBodyProps) => {
  const { data } = useContext(CodeBlockContext);

  return <div {...props}>{data.map(children)}</div>;
};

export type CodeBlockItemProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  lineNumbers?: boolean;
};

export const CodeBlockItem = ({
  children,
  lineNumbers = true,
  className,
  value,
  ...props
}: CodeBlockItemProps) => {
  const { value: activeValue } = useContext(CodeBlockContext);

  if (value !== activeValue) {
    return null;
  }

  return (
    <div
      className={cn(
        codeBlockClassName,
        lineHighlightClassNames,
        lineDiffClassNames,
        lineFocusedClassNames,
        wordHighlightClassNames,
        darkModeClassNames,
        lineNumbers && lineNumberClassNames,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export type CodeBlockContentProps = HTMLAttributes<HTMLDivElement> & {
  themes?: CodeOptionsMultipleThemes["themes"];
  language?: BundledLanguage;
  syntaxHighlighting?: boolean;
  children: string;
};

export const CodeBlockContent = ({
  children,
  themes: _themes,
  language,
  syntaxHighlighting = true,
  ...props
}: CodeBlockContentProps) => {
  const [html, setHtml] = useState<string | null>(null);
  void _themes;

  useEffect(() => {
    if (!syntaxHighlighting) {
      return;
    }

    highlight(children as string, language)
      .then(setHtml)
      // biome-ignore lint/suspicious/noConsole: "it's fine"
      .catch(console.error);
  }, [children, syntaxHighlighting, language]);

  if (!(syntaxHighlighting && html)) {
    return <CodeBlockFallback>{children}</CodeBlockFallback>;
  }

  return (
    <div
      // biome-ignore lint/security/noDangerouslySetInnerHtml: "Kinda how Shiki works"
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
};
