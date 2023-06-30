const path = require("path");
const { program } = require("commander");
const chalk = require("chalk");
const fs = require("fs-extra");

const pkg = require("./package.json");

function init() {
  program
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version)
    .arguments("<project-directory>")
    .usage(`${chalk.green("<project-directory>")} [options]`)
    .action(async (dir) => {
      const root = process.cwd();
      const fullPath = getFullPath(root, dir);

      console.log(
        `☝️ A new Curator project will be created at ${chalk.blue(fullPath)}`
      );

      if (await pathIsNotEmpty(fullPath)) {
        console.error(
          chalk.red(
            "❌ The chosen directory already exists and contains files."
          )
        );
        process.exit(1);
      }

      await createProject(root, dir);

      console.log(chalk.green("✅ Curator project has been created."));
      console.log(
        chalk.blue("👉 Go into the new directory and install dependencies.")
      );
    });

  program.parse(process.argv);
}

async function pathIsNotEmpty(path) {
  const exists = await fs.pathExists(path);

  if (exists) {
    const ls = await fs.readdir(path);
    return ls.length > 0;
  }

  return false;
}

function getFullPath(root, dir) {
  return path.resolve(root, dir);
}

async function createProject(root, dir) {
  const dest = getFullPath(root, dir);
  await fs.ensureDir(dest);

  // Copy template directory to destination
  await fs.copy(path.resolve(__dirname, "template"), dest);

  // Update package name to project name
  const pkg = await fs.readJson(path.resolve(dest, "./package.json"));
  pkg.name = dir;
  fs.writeJson(path.resolve(dest, "package.json"), pkg, { spaces: 2 });
}

module.exports = { init };
