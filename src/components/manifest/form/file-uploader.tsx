'use client';

import { Button } from '@hyper/manifest-ui/components/ui/button';
import { Card } from '@hyper/manifest-ui/components/ui/card';
import { cn } from '@hyper/manifest-ui/lib/utils';
import { FileImage, FileSpreadsheet, FileText, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 文件上传条目，用于文件列表展示。
 */
export type FileUploaderItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
};

/**
 * 可接受的文件类型配置。
 */
export type AcceptedFileType = {
  label: string;
  icon: typeof FileImage;
  extensions: string[];
};

export const DEFAULT_ACCEPTED_FILE_TYPES: AcceptedFileType[] = [
  { label: 'Image', icon: FileImage, extensions: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'] },
  { label: 'PDF', icon: FileText, extensions: ['.pdf'] },
  { label: 'Document', icon: FileSpreadsheet, extensions: ['.doc', '.docx', '.xlsx', '.csv', '.txt'] },
];

export const DEFAULT_ACCEPT = [
  '.pdf', '.doc', '.docx', '.xlsx', '.csv', '.txt',
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv', 'text/plain',
  'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml',
].join(',');

const ICON_TRANSFORMS = [
  { idle: 'translate(-78%, -50%) rotate(-8deg)', active: 'translate(-114%, -50%) rotate(-12deg) scale(1.08)' },
  { idle: 'translate(-50%, -50%) rotate(0deg)', active: 'translate(-50%, -50%) rotate(0deg) scale(1.18)' },
  { idle: 'translate(-22%, -50%) rotate(8deg)', active: 'translate(14%, -50%) rotate(12deg) scale(1.08)' },
];

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  return accept.split(',').some((rawToken) => {
    const token = rawToken.trim().toLowerCase();
    if (!token) return false;
    if (token.startsWith('.')) return file.name.toLowerCase().endsWith(token);
    if (token.endsWith('/*')) return file.type.toLowerCase().startsWith(token.slice(0, -1));
    return file.type.toLowerCase() === token;
  });
}

function toUploadItems(files: FileList | File[]): FileUploaderItem[] {
  return Array.from(files).map((file) => ({
    id: `${file.name}-${file.size}-${file.lastModified}`,
    name: file.name,
    type: file.type || 'Unknown type',
    size: file.size,
    url: URL.createObjectURL(file),
  }));
}

function getFileExtensionBadge(file: File) {
  const ext = file.name.split('.').pop()?.toUpperCase() || '?';
  return ext.length <= 4 ? ext : ext.slice(0, 4);
}

function UploadIconCluster({ acceptedFileTypes, isDragging }: { acceptedFileTypes: AcceptedFileType[]; isDragging: boolean }) {
  const singleIcon = acceptedFileTypes.length === 1;
  const displayTypes = acceptedFileTypes.slice(0, 3);

  return (
    <div className="relative h-14 w-36">
      {displayTypes.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Card
            key={item.label}
            className={cn(
              'absolute top-1/2 left-1/2 grid size-12 place-items-center rounded-xl bg-card text-muted-foreground transition-[transform,color,background-color] duration-500',
              index === 1 && 'z-10',
              isDragging && 'bg-popover text-foreground shadow-md shadow-black/10'
            )}
            style={{
              transform: singleIcon
                ? `translate(-50%, -50%) scale(${isDragging ? 1.14 : 1})`
                : isDragging
                  ? ICON_TRANSFORMS[index]?.active
                  : ICON_TRANSFORMS[index]?.idle,
            }}
          >
            <IconComponent className="size-5" />
          </Card>
        );
      })}
    </div>
  );
}

/**
 * FileUploader 组件的 props。
 */
export interface FileUploaderProps {
  /** 接受的文件类型（MIME 或扩展名），逗号分隔。默认支持常见文档和图片格式 */
  accept?: string;
  /** 可接受文件类型图标配置 */
  acceptedFileTypes?: AcceptedFileType[];
  /** 浏览按钮文字 */
  browseLabel?: string;
  /** 自定义样式类名 */
  className?: string;
  /** 上传区描述文字 */
  description?: string;
  /** 拖拽时的提示文字 */
  draggingLabel?: string;
  /** 是否允许多文件上传 */
  multiple?: boolean;
  /** 是否显示文件列表 */
  showFileList?: boolean;
  /** 上传区标题 */
  title?: string;
  /** 文件接受后的回调 */
  onFilesAccepted?: (files: File[]) => void;
  /** 文件变更回调（含 id/name/type/size/url） */
  onFilesChange?: (files: FileUploaderItem[]) => void;
}

/**
 * 文件上传组件，支持拖拽和点击选择。
 *
 * 提供带图标的拖拽上传区域、文件类型提示，以及上传后的文件列表展示。
 * 适用于表单附件上传、文档提交等场景。
 *
 * @component
 * @example
 * ```tsx
 * import { FileUploader } from "@/components/ui/manifest-file-uploader"
 *
 * export default function Demo() {
 *   return <FileUploader onFilesChange={(files) => console.log(files)} />
 * }
 * ```
 */
export function FileUploader({
  accept = DEFAULT_ACCEPT,
  acceptedFileTypes = DEFAULT_ACCEPTED_FILE_TYPES,
  browseLabel = 'Browse files',
  className,
  description = 'PDF, DOC/DOCX, XLSX, CSV, PNG, JPG files are supported',
  draggingLabel = 'Drop to add',
  multiple = true,
  showFileList = true,
  title = 'Click to upload or drop files',
  onFilesAccepted,
  onFilesChange,
}: FileUploaderProps) {
  const dragDepthRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileUploaderItem[]>([]);
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);

  const commitFiles = useCallback(
    (nextFiles: FileList | File[]) => {
      const acceptedFiles = Array.from(nextFiles)
        .filter((file) => matchesAccept(file, accept))
        .slice(0, multiple ? undefined : 1);

      if (acceptedFiles.length === 0) {
        setRejectionMessage('This file type is not supported here.');
        return;
      }

      setRejectionMessage(null);
      onFilesAccepted?.(acceptedFiles);

      const items = toUploadItems(acceptedFiles);
      setFiles((previousFiles) => {
        previousFiles.forEach((f) => URL.revokeObjectURL(f.url));
        return items;
      });
      onFilesChange?.(items);
    },
    [accept, multiple, onFilesAccepted, onFilesChange]
  );

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.url));
    };
  }, [files]);

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const removeFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => {
        const updated = prev.filter((f) => f.id !== fileId);
        const removed = prev.find((f) => f.id === fileId);
        if (removed) URL.revokeObjectURL(removed.url);
        return updated;
      });
    },
    []
  );

  return (
    <div className={cn('space-y-3', className)}>
      <div
        role="button"
        tabIndex={0}
        className={cn(
          'relative flex min-h-64 cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden rounded-[1.125rem] border border-dashed bg-card px-6 py-10 text-center transition-[border-color,background-color] duration-200',
          isDragging
            ? 'border-foreground/40 bg-accent/35'
            : 'border-foreground/20 hover:border-foreground/35 hover:bg-muted/35 dark:border-foreground/25 dark:hover:border-foreground/40'
        )}
        onClick={openFileDialog}
        onDragEnter={(e) => { e.preventDefault(); dragDepthRef.current += 1; setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); dragDepthRef.current = Math.max(0, dragDepthRef.current - 1); if (dragDepthRef.current === 0) setIsDragging(false); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); dragDepthRef.current = 0; setIsDragging(false); if (e.dataTransfer.files.length > 0) commitFiles(e.dataTransfer.files); }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFileDialog(); } }}
      >
        <UploadIconCluster acceptedFileTypes={acceptedFileTypes} isDragging={isDragging} />
        <div className="space-y-1">
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
          {rejectionMessage ? (
            <div className="text-xs text-destructive">{rejectionMessage}</div>
          ) : null}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Upload className="size-3.5" />
          <span>{isDragging ? draggingLabel : browseLabel}</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => { if (e.target.files) { commitFiles(e.target.files); e.currentTarget.value = ''; } }}
        />
      </div>

      {showFileList && files.length > 0 && (
        <div className="rounded-xl border bg-card">
          {files.map((file, index) => (
            <div
              key={file.id}
              className="flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-[10px] font-medium text-muted-foreground">
                {getFileExtensionBadge({ name: file.name, type: file.type } as File)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{file.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {file.type} - {formatBytes(file.size)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                  Ready
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label={`Remove ${file.name}`}
                  onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
