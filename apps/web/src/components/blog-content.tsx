import type { BlogContent as BlogContentValue } from "@repo/types/admin/blog";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";
import { resolveApiUrl } from "@/lib/api";

type BlogContentProps = {
  content: BlogContentValue;
};

const BlogImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "center",
        parseHTML: (element) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes) => ({
          "data-align": attributes.align || "center",
        }),
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.getAttribute("width") || element.style.width.replace("px", "");

          return width ? Number.parseInt(width, 10) : null;
        },
        renderHTML: (attributes) =>
          attributes.width ?
            {
              width: attributes.width,
              style: `width: ${attributes.width}px;`,
            }
          : {},
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height = element.getAttribute("height") || element.style.height.replace("px", "");

          return height ? Number.parseInt(height, 10) : null;
        },
        renderHTML: (attributes) => (attributes.height ? { height: attributes.height } : {}),
      },
    };
  },
});

const extensions = [
  StarterKit,
  Link.configure({
    HTMLAttributes: {
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),
  BlogImage.configure({
    HTMLAttributes: {
      class: "rounded-lg border border-foreground/10",
    },
  }),
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function resolveImageUrls(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(resolveImageUrls);
  }

  if (!isRecord(value)) {
    return value;
  }

  const attrs = isRecord(value.attrs) ? value.attrs : undefined;
  const resolvedAttrs =
    value.type === "image" && typeof attrs?.src === "string" ?
      { ...attrs, src: resolveApiUrl(attrs.src) }
    : attrs;

  return {
    ...value,
    ...(resolvedAttrs ? { attrs: resolvedAttrs } : {}),
    ...(Array.isArray(value.content) ? { content: value.content.map(resolveImageUrls) } : {}),
  };
}

export function BlogContent({ content }: BlogContentProps) {
  const renderedContent = useMemo(
    () =>
      renderToReactElement({
        extensions,
        content: resolveImageUrls(content) as Parameters<typeof renderToReactElement>[0]["content"],
      }),
    [content],
  );

  return (
    <div className="mx-auto max-w-3xl text-base leading-8 text-foreground after:clear-both after:block [&_a]:font-medium [&_a]:text-primary [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-5 [&_blockquote]:font-heading [&_blockquote]:text-xl [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_h2]:font-heading [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:font-heading [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-semibold [&_hr]:my-10 [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img[data-align='center']]:mx-auto [&_img[data-align='full']]:w-full [&_img[data-align='left']]:float-left [&_img[data-align='left']]:mr-6 [&_img[data-align='right']]:float-right [&_img[data-align='right']]:ml-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-5 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-4 [&_ul]:list-disc [&_ul]:pl-6">
      {renderedContent}
    </div>
  );
}
