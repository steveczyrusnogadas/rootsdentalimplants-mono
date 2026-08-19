import type { BlogContent } from "@repo/types/admin/blog";
import type { Content } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { Separator } from "@repo/ui/components/separator";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  PilcrowIcon,
  Redo2Icon,
  StrikethroughIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { MediaPicker } from "@/components/media-picker";

type BlogEditorProps = {
  value: BlogContent;
  disabled?: boolean;
  onChange: (value: BlogContent) => void;
};

type BlogImageAlign = "left" | "center" | "right" | "full";

type BlogImageAttrs = {
  src: string;
  alt?: string | null;
  align?: BlogImageAlign;
  width?: number | null;
};

const DEFAULT_IMAGE_WIDTH = 640;
const iconClassName = "size-4";

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
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),
  BlogImage.configure({
    resize: {
      enabled: true,
      directions: ["bottom-right", "bottom-left", "top-right", "top-left"],
      minWidth: 80,
      minHeight: 80,
      alwaysPreserveAspectRatio: true,
    },
    HTMLAttributes: {
      class: "rounded-lg border border-border",
    },
  } as Parameters<typeof BlogImage.configure>[0] & {
    resize: {
      enabled: boolean;
      directions: string[];
      minWidth: number;
      minHeight: number;
      alwaysPreserveAspectRatio: boolean;
    };
  }),
  Placeholder.configure({
    placeholder: "Write the story...",
  }),
];

function insertBlogImage(editor: Editor, attrs: BlogImageAttrs) {
  editor
    .chain()
    .focus()
    .setImage({
      ...attrs,
      align: attrs.align ?? "center",
      width: attrs.width ?? DEFAULT_IMAGE_WIDTH,
    } as Parameters<ReturnType<Editor["chain"]>["setImage"]>[0] & {
      align: BlogImageAlign;
      width: number;
    })
    .run();
}

function ToolbarButton({
  active,
  ariaLabel,
  disabled,
  children,
  onClick,
  title,
}: {
  active?: boolean;
  ariaLabel: string;
  disabled?: boolean;
  children: ReactNode;
  onClick: () => void;
  title?: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "ghost"}
      size="icon-xs"
      aria-label={ariaLabel}
      disabled={disabled}
      title={title ?? ariaLabel}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function LinkControl({ editor, disabled, compact = false }: { editor: Editor; disabled?: boolean; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      setUrl((editor.getAttributes("link").href as string | undefined) ?? "");
    }
  }

  function submitLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: trimmedUrl }).run();
    }

    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={editor.isActive("link") ? "default" : "ghost"}
          size="icon-xs"
          aria-label={compact ? "Edit link" : "Add link"}
          disabled={disabled}
          title={compact ? "Edit link" : "Add link"}
        >
          <LinkIcon className={iconClassName} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>Add link</PopoverTitle>
          <PopoverDescription>Highlight text in the editor, then paste the URL it should open.</PopoverDescription>
        </PopoverHeader>
        <form className="space-y-3" onSubmit={submitLink}>
          <div className="grid gap-2">
            <Label htmlFor="blog-editor-link-url">URL</Label>
            <Input
              id="blog-editor-link-url"
              value={url}
              placeholder="https://example.com"
              onChange={(event) => setUrl(event.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Apply
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

function InlineImageControl({ editor, disabled }: { editor: Editor; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [url, setUrl] = useState("");

  function submitImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      return;
    }

    insertBlogImage(editor, { src: trimmedUrl });
    setUrl("");
    setOpen(false);
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Insert media image"
        disabled={disabled}
        title="Insert media image"
        onClick={() => setPickerOpen(true)}
      >
        <ImageIcon className={iconClassName} />
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Insert image URL"
            disabled={disabled}
            title="Insert image URL"
          >
            <LinkIcon className={iconClassName} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <PopoverHeader>
            <PopoverTitle>Manual image URL</PopoverTitle>
            <PopoverDescription>
              Paste an external image URL only when the image is not in your Media Library.
            </PopoverDescription>
          </PopoverHeader>
          <form className="space-y-3" onSubmit={submitImage}>
            <div className="grid gap-2">
              <Label htmlFor="blog-editor-image-url">Image URL</Label>
              <Input
                id="blog-editor-image-url"
                value={url}
                placeholder="https://example.com/image.jpg"
                onChange={(event) => setUrl(event.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!url.trim()}>
                Insert
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
      <MediaPicker
        open={pickerOpen}
        title="Insert media image"
        description="Choose an uploaded image to insert into the article body, or upload a new one."
        selectLabel="Insert"
        onOpenChange={setPickerOpen}
        onSelect={(asset) => {
          insertBlogImage(editor, { src: asset.url, alt: asset.altText ?? asset.fileName });
        }}
      />
    </>
  );
}

export function BlogEditor({ value, disabled = false, onChange }: BlogEditorProps) {
  const content = value as Content;
  const editor = useEditor({
    extensions,
    content,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON() as BlogContent);
    },
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(value);

    if (current !== next) {
      editor.commands.setContent(content);
    }
  }, [content, editor, value]);

  if (!editor) {
    return <div className="min-h-72 rounded-md border border-dashed bg-muted/30" />;
  }

  return (
    <div className="overflow-hidden rounded-md border bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-2">
        <ToolbarButton ariaLabel="Normal text" disabled={disabled} active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
          <PilcrowIcon className={iconClassName} />
        </ToolbarButton>
        <ToolbarButton ariaLabel="Heading 1" disabled={disabled} active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1Icon className={iconClassName} />
        </ToolbarButton>
        <ToolbarButton ariaLabel="Heading 2" disabled={disabled} active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2Icon className={iconClassName} />
        </ToolbarButton>
        <ToolbarButton ariaLabel="Heading 3" disabled={disabled} active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3Icon className={iconClassName} />
        </ToolbarButton>
        <ToolbarButton ariaLabel="Bullet list" disabled={disabled} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <ListIcon className={iconClassName} />
        </ToolbarButton>
        <ToolbarButton ariaLabel="Numbered list" disabled={disabled} active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrderedIcon className={iconClassName} />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarButton ariaLabel="Bold" disabled={disabled} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <BoldIcon className={iconClassName} />
        </ToolbarButton>
        <ToolbarButton ariaLabel="Italic" disabled={disabled} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <ItalicIcon className={iconClassName} />
        </ToolbarButton>
        <ToolbarButton ariaLabel="Underline" disabled={disabled} active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className={iconClassName} />
        </ToolbarButton>
        <ToolbarButton ariaLabel="Strikethrough" disabled={disabled} active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <StrikethroughIcon className={iconClassName} />
        </ToolbarButton>
        <ToolbarButton ariaLabel="Inline code" disabled={disabled} active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <CodeIcon className={iconClassName} />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarButton ariaLabel="Align left" disabled={disabled} active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeftIcon className={iconClassName} />
        </ToolbarButton>
        <ToolbarButton ariaLabel="Align center" disabled={disabled} active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenterIcon className={iconClassName} />
        </ToolbarButton>
        <ToolbarButton ariaLabel="Align right" disabled={disabled} active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRightIcon className={iconClassName} />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <LinkControl editor={editor} disabled={disabled} />
        <InlineImageControl editor={editor} disabled={disabled} />
        <ToolbarButton ariaLabel="Insert horizontal rule" disabled={disabled} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <MinusIcon className={iconClassName} />
        </ToolbarButton>
        <ToolbarButton ariaLabel="Undo" disabled={disabled || !editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2Icon className={iconClassName} />
        </ToolbarButton>
        <ToolbarButton ariaLabel="Redo" disabled={disabled || !editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2Icon className={iconClassName} />
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-96 px-4 py-3 [&_.ProseMirror]:min-h-96 [&_.ProseMirror]:outline-none [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-muted-foreground [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_h1]:font-heading [&_.ProseMirror_h1]:text-4xl [&_.ProseMirror_h2]:font-heading [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h3]:font-heading [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_img]:my-4 [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img.ProseMirror-selectednode]:ring-2 [&_.ProseMirror_img.ProseMirror-selectednode]:ring-ring [&_.ProseMirror_img[data-align='center']]:mx-auto [&_.ProseMirror_img[data-align='full']]:w-full [&_.ProseMirror_img[data-align='left']]:float-left [&_.ProseMirror_img[data-align='left']]:mr-5 [&_.ProseMirror_img[data-align='right']]:float-right [&_.ProseMirror_img[data-align='right']]:ml-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_p]:my-3 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:rounded-md [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-3 [&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:p-0 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6"
      />
    </div>
  );
}
