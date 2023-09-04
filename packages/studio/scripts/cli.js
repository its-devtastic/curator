const path = require("path");
const { program } = require("commander");
const { createServer, build } = require("vite");
const defaultTheme = require("tailwindcss/defaultTheme");

const pkg = require("../package.json");

const safelist = [
  "lg:col-span-1",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-4",
  "lg:col-span-5",
  "lg:col-span-6",
  "lg:col-span-7",
  "lg:col-span-8",
  "lg:col-span-9",
  "lg:col-span-10",
  "lg:col-span-11",
  "lg:col-span-12",
];

function init() {
  program.name(pkg.name).description(pkg.description).version(pkg.version);

  program.command("dev").action(async (dir) => {
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
              // config: path.resolve(__dirname, "../tailwind.config.js"),
              corePlugins: { preflight: false },
              content: [
                path.resolve(__dirname, "../app/**/*.{js,ts,jsx,tsx}"),
                path.resolve(root, "./config/**/*.{js,ts,jsx,tsx}"),
              ],
              safelist,
              darkMode: "class",
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
          "@": path.resolve(__dirname, "../app"),
          react: path.resolve(root, "node_modules/react"),
        },
      },
      css: {
        postcss: {
          plugins: [
            require("tailwindcss/nesting"),
            require("tailwindcss")({
              // config: path.resolve(__dirname, "../tailwind.config.js"),
              corePlugins: { preflight: false },
              content: [
                path.resolve(__dirname, "../app/**/*.{js,ts,jsx,tsx}"),
                path.resolve(root, "./config/**/*.{js,ts,jsx,tsx}"),
              ],
              safelist,
              darkMode: "class",
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
