import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindDefaultConfig from "@curatorjs/ui/tailwindDefaultConfig.js";
import { program } from "commander";
import { build, createServer } from "vite";
const require = createRequire(import.meta.url);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkg = require("../package.json");

export function init() {
  program.name(pkg.name).description(pkg.description).version(pkg.version);

  program.command("dev").action(async () => {
    const root = process.cwd();

    const server = await createServer({
      root,
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../app"),
          react: path.resolve(root, "node_modules/react"),
        },
      },
      css: {
        postcss: {
          plugins: [
            require("tailwindcss/nesting"),
            require("tailwindcss")({
              ...tailwindDefaultConfig,
              content: [
                path.resolve(__dirname, "../app/**/*.{js,ts,jsx,tsx}"),
                path.resolve(root, "./config/**/*.{js,ts,jsx,tsx}"),
                path.resolve(
                  root,
                  "./node_modules/@curatorjs/**/*.{js,ts,jsx,tsx}",
                ),
                path.resolve(
                  __dirname,
                  "../../../node_modules/@curatorjs/**/*.{js,ts,jsx,tsx}",
                ),
              ],
            }),
            require("autoprefixer")(),
          ],
        },
      },
      server: {
        port: 1338,
        fs: {
          allow: ["/"],
        },
      },
    });
    await server.listen();

    server.printUrls();
  });

  program.command("build").action(async () => {
    const root = process.cwd();

    await build({
      root,
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../app"),
          react: path.resolve(root, "node_modules/react"),
        },
      },
      css: {
        postcss: {
          plugins: [
            require("tailwindcss/nesting"),
            require("tailwindcss")({
              ...tailwindDefaultConfig,
              content: [
                path.resolve(__dirname, "../app/**/*.{js,ts,jsx,tsx}"),
                path.resolve(root, "./config/**/*.{js,ts,jsx,tsx}"),
                path.resolve(
                  root,
                  "./node_modules/@curatorjs/**/*.{js,ts,jsx,tsx}",
                ),
                path.resolve(
                  __dirname,
                  "../../../node_modules/@curatorjs/**/*.{js,ts,jsx,tsx}",
                ),
              ],
            }),
            require("autoprefixer")(),
          ],
        },
      },
    });
  });

  program.parse(process.argv);
}
