import React from "react";
import { CircleCheck as CheckCircle2, CircleX as XCircle, Info, TriangleAlert as AlertTriangle, FileQuestionMark as FileQuestion, Lock, ServerOff } from "lucide-react";
import { cn } from "@/_internals/foundations/utils/cn";

export type ResultStatus =
  | "success"
  | "error"
  | "info"
  | "warning"
  | 404
  | "404"
  | 403
  | "403"
  | 500
  | "500";

const statusIcons: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="text-green-500" />,
  error: <XCircle className="text-destructive" />,
  info: <Info className="text-blue-500" />,
  warning: <AlertTriangle className="text-yellow-500" />,
  404: <FileQuestion className="text-muted-foreground" />,
  403: <Lock className="text-muted-foreground" />,
  500: <ServerOff className="text-muted-foreground" />,
};

export interface ResultProps extends Omit<React.ComponentProps<"div">, "title"> {
  status?: ResultStatus;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  icon?: React.ReactNode;
  extra?: React.ReactNode | React.ReactNode[];
  children?: React.ReactNode;
}

export const Result = React.forwardRef<HTMLDivElement, ResultProps>(
  (
    { status = "info", title, subTitle, icon, extra, children, className, ...props },
    ref
  ) => {
    const displayIcon = icon === false || icon === null ? null : icon || statusIcons[String(status)];
    const extraItems = Array.isArray(extra) ? extra : extra === undefined ? [] : [extra];

    return (
      <div
        ref={ref}
        data-slot="result"
        className={cn(
          "flex flex-col items-center justify-center gap-6 px-8 py-12 text-center",
          className
        )}
        {...props}
      >
        {displayIcon && (
          <div data-slot="result-icon" className="h-16 w-16 [&>svg]:h-full [&>svg]:w-full">
            {displayIcon}
          </div>
        )}

        <div>
          {title && (
            <h3 data-slot="result-title" className="text-2xl font-semibold">
              {title}
            </h3>
          )}
          {subTitle && (
            <p
              data-slot="result-subtitle"
              className="text-sm text-muted-foreground max-w-md"
            >
              {subTitle}
            </p>
          )}
        </div>

        {children && <div data-slot="result-content">{children}</div>}

        {extraItems.length > 0 && (
          <div data-slot="result-extra" className="flex flex-wrap items-center justify-center gap-3">
            {extraItems.map((item, index) => (
              <React.Fragment key={index}>{item}</React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Result.displayName = "Result";
