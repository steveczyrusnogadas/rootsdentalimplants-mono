import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { ThemeProvider as WebThemeProvider, useTheme as useWebTheme } from "../src/components/ui/theme-provider";
import { ThemeProvider as AdminThemeProvider, useTheme as useAdminTheme } from "../../admin/src/components/ui/theme-provider";

const apps = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(tsx?|css)$/.test(path) ? [path] : [];
  });
}

describe("app-owned presentation", () => {
  for (const app of ["web", "admin"]) {
    test(`${app} generates and imports presentation within its own app`, () => {
      const directory = join(apps, app);
      const config = JSON.parse(readFileSync(join(directory, "components.json"), "utf8"));
      expect(config.tailwind.css).toBe("src/index.css");
      expect(config.aliases.ui).toBe("@/components/ui");
      expect(config.aliases.utils).toBe("@/lib/utils");
      const manifest = JSON.parse(readFileSync(join(directory, "package.json"), "utf8"));
      expect(manifest.dependencies["@repo/ui"]).toBeUndefined();
      const css = readFileSync(join(directory, "src/index.css"), "utf8");
      expect(css).toContain('@import "tailwindcss" source(".")');
      expect(css).not.toContain("@source");
      for (const file of sourceFiles(join(directory, "src"))) {
        const source = readFileSync(file, "utf8");
        const imports = [...source.matchAll(/(?:from\s+|import\s*(?:\(\s*)?|@import\s+)["']([^"']+)/g)];
        for (const [, specifier] of imports) {
          expect(specifier.startsWith("@repo/ui")).toBe(false);
          if (specifier.startsWith(".")) {
            expect(resolve(dirname(file), specifier).startsWith(`${directory}/`)).toBe(true);
          }
        }
      }
    });
  }
});

for (const [app, Provider, useTheme] of [
  ["web", WebThemeProvider, useWebTheme],
  ["admin", AdminThemeProvider, useAdminTheme],
] as const) {
  test(`${app} theme renders without browser APIs using an explicit storage identity`, () => {
    function ThemeStatus() {
      const { theme, resolvedTheme } = useTheme();
      return createElement("span", null, `${theme}:${resolvedTheme}`);
    }
    const render = () => renderToString(createElement(Provider, {
      defaultTheme: "system",
      storageKey: `${app}-custom-theme`,
      children: createElement(ThemeStatus),
    }));
    const serverMarkup = render();
    expect(serverMarkup).toBe("<span>system:light</span>");
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
    try {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        get() { throw new Error("Browser state must not be read during initial rendering"); },
      });
      expect(render()).toBe(serverMarkup);
    } finally {
      if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
      else Reflect.deleteProperty(globalThis, "window");
    }
  });
}
