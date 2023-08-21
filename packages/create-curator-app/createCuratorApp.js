import { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";
import { program } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import inquirer from "inquirer";
import shell from "shelljs";
import ora from "ora";

export async function init() {
  const { name, description, version } = JSON.parse(
    await fs.readFile("./package.json")
  );

  program
    .name(name)
    .description(description)
    .version(version)
    .arguments("<project-directory>")
    .usage(`${chalk.greenBright("<project-directory>")} [options]`)
    .showHelpAfterError(
      "You forgot to provide a " +
        chalk.bold("name") +
        " for the project directory."
    )
    .action(async (dir) => {
      const root = process.cwd();
      const fullPath = getFullPath(root, dir);

      console.log(
        `🏗️A new Curator Studio project will be created at ${chalk.blue(
          fullPath
        )}`
      );

      if (await pathIsNotEmpty(fullPath)) {
        console.error(
          chalk.red(
            "❌  The chosen directory already exists and contains files."
          )
        );
        process.exit(1);
      }

      await createProject(root, dir);

      console.log(chalk.green("✅  Curator project has been created."));

      /*
       * Ask for the preferred package manager and install packages.
       */
      inquirer
        .prompt([
          {
            type: "list",
            name: "pkgManager",
            message:
              "What package manager do you want to use to install dependencies?",
            choices: [
              "npm",
              "yarn",
              { name: "Skip installing dependencies", value: "skip" },
            ],
          },
        ])
        .then(({ pkgManager }) => {
          if (pkgManager === "skip") {
            console.log(
              "☝️ Don't forget to manually install the dependencies."
            );
          } else {
            const spinner = ora(
              chalk.blueBright(
                "Installing dependencies with " + chalk.bold(pkgManager) + "..."
              )
            ).start();
            shell.cd(dir);
            shell.exec(`${pkgManager} install`, (code) => {
              spinner.stop();
              console.log(
                chalk.greenBright("Running Curator development server...")
              );
              shell.exec(
                `${pkgManager}${pkgManager === "npm" ? " run" : ""} dev`
              );
            });
          }
        });
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
  return resolve(root, dir);
}

async function createProject(root, dir) {
  const dest = getFullPath(root, dir);
  await fs.ensureDir(dest);
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Copy template directory to destination
  await fs.copy(resolve(__dirname, "template"), dest);

  // Update package name to project name
  const pkg = await fs.readJson(resolve(dest, "./package.json"));
  pkg.name = dir;
  fs.writeJson(resolve(dest, "package.json"), pkg, { spaces: 2 });
}
