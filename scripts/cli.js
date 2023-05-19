const path = require("path");
const { program } = require("commander");
const chalk = require("chalk");
const fs = require("fs-extra");
const { createServer } = require("vite");

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

  program.parse(process.argv);
}

module.exports = { init };
