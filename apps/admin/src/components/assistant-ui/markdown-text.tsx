import {
  MarkdownTextPrimitive,
  unstable_memoizeMarkdownComponents as memoizeMarkdownComponents,
  useIsMarkdownCodeBlock,
} from "@assistant-ui/react-markdown";
import { cn } from "@/lib/utils";
import { memo } from "react";
import remarkGfm from "remark-gfm";

const defaultComponents = memoizeMarkdownComponents({
  h1: ({ className, ...props }) => (
    <h1 className={cn("mb-2 scroll-m-20 text-xl font-bold tracking-tight last:mb-0", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn("mb-2 mt-3 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0 last:mb-0", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn("mb-2 mt-3 scroll-m-20 text-base font-semibold tracking-tight first:mt-0 last:mb-0", className)}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4 className={cn("mb-1 mt-2 scroll-m-20 text-sm font-semibold first:mt-0 last:mb-0", className)} {...props} />
  ),
  h5: ({ className, ...props }) => (
    <h5 className={cn("my-2 text-sm font-semibold first:mt-0 last:mb-0", className)} {...props} />
  ),
  h6: ({ className, ...props }) => (
    <h6 className={cn("my-2 text-sm font-medium first:mt-0 last:mb-0", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("mb-2 leading-relaxed last:mb-0", className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn("font-medium text-primary underline underline-offset-4", className)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote className={cn("my-2 border-l-2 pl-3 italic text-muted-foreground", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-2 ml-4 list-disc [&>li]:mt-1", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-2 ml-4 list-decimal [&>li]:mt-1", className)} {...props} />
  ),
  hr: ({ className, ...props }) => <hr className={cn("my-4 border-border", className)} {...props} />,
  table: ({ className, ...props }) => (
    <table className={cn("my-2 w-full border-collapse text-sm", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn("border border-border bg-muted px-2 py-1 text-left font-semibold", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td className={cn("border border-border px-2 py-1", className)} {...props} />
  ),
  tr: ({ className, ...props }) => <tr className={cn("border-b border-border", className)} {...props} />,
  li: ({ className, ...props }) => <li className={cn("leading-relaxed", className)} {...props} />,
  sup: ({ className, ...props }) => (
    <sup className={cn("[&>a]:text-xs [&>a]:no-underline", className)} {...props} />
  ),
  pre: ({ className, ...props }) => (
    <pre className={cn("my-2 overflow-x-auto rounded-md bg-muted p-3 text-xs", className)} {...props} />
  ),
  code: function Code({ className, ...props }) {
    const isCodeBlock = useIsMarkdownCodeBlock();

    return (
      <code
        className={cn(
          isCodeBlock ? "font-mono" : "rounded bg-muted px-1 py-0.5 font-mono text-xs",
          className,
        )}
        {...props}
      />
    );
  },
});

function MarkdownTextImpl() {
  return (
    <MarkdownTextPrimitive
      remarkPlugins={[remarkGfm]}
      className="aui-md text-sm"
      components={defaultComponents}
    />
  );
}

export const MarkdownText = memo(MarkdownTextImpl);
