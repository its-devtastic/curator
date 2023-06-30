const path = require("path");
const { program } = require("commander");
const chalk = require("chalk");
const fs = require("fs-extra");
const { createServer, build } = require("vite");
const defaultTheme = require("tailwindcss/defaultTheme");

const pkg = require("../package.json");

function init() {
  program.name(pkg.name).description(pkg.description).version(pkg.version);

  program.command("dev").action(async (dir) => {
    const root = process.cwd();

    const server = await createServer({
      root,
      resolve: {
        alias: {
          "~": path.resolve(__dirname, "../app"),
          react: path.resolve(root, "node_modules/react"),
        },
      },
      build: {
        rollupOptions: {
          input: {
            app: path.resolve(__dirname, "../app/index.html"),
          },
        },
      },
      css: {
        postcss: {
          plugins: [
            require("tailwindcss")({
              // config: path.resolve(__dirname, "../tailwind.config.js"),
              corePlugins: { preflight: false },
              content: [
                path.resolve(__dirname, "../app/**/*.{js,ts,jsx,tsx}"),
                path.resolve(root, "./config/**/*.{js,ts,jsx,tsx}"),
              ],
              theme: {
                extend: {
                  fontFamily: {
                    sans: ["Inter", ...defaultTheme.fontFamily.sans],
                  },
                },
              },
            }),
            require("autoprefixer")(),
          ],
        },
      },
      server: {
        port: 1338,
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
          "~": path.resolve(__dirname, "../app"),
          react: path.resolve(root, "node_modules/react"),
        },
      },
      css: {
        postcss: {
          plugins: [
            require("tailwindcss")({
              // config: path.resolve(__dirname, "../tailwind.config.js"),
              corePlugins: { preflight: false },
              content: [
                path.resolve(__dirname, "../app/**/*.{js,ts,jsx,tsx}"),
                path.resolve(root, "./config/**/*.{js,ts,jsx,tsx}"),
              ],
              theme: {
                extend: {
                  fontFamily: {
                    sans: ["Inter", ...defaultTheme.fontFamily.sans],
                  },
                },
              },
            }),
            require("autoprefixer")(),
          ],
        },
      },
    });
  });

  program.parse(process.argv);
}

module.exports = { init };
