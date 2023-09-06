import { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";
import { program, Option } from "commander";
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
    .argument("[dir]", "Directory where Curator should be installed.", "")
    .addOption(
      new Option("-c, --component <components...>").choices([
        "web",
        "admin",
        "platform",
      ])
    )
    .addOption(
      new Option("-p, --packageManager <name>").choices(["npm", "yarn"])
    )
    .action(async (dir, opts) => {
      const root = process.cwd();

      const { projectDir, components, pkgManager } = await inquirer.prompt([
        {
          type: "input",
          name: "projectDir",
          when: () => !dir,
          default: dir,
          message: "Please provide the directory where to set up Curator",
        },
        {
          type: "checkbox",
          name: "components",
          when: () => !opts.component,
          message: "Which components do you want to use?",
          default: opts.component || ["admin", "web", "platform"],
          choices: [
            { name: "Studio", value: "admin" },
            { name: "Next.js website with Bridge", value: "web" },
            { name: "Content Platform", value: "platform" },
          ],
        },
        {
          type: "list",
          name: "pkgManager",
          message:
            "What package manager do you want to use to install dependencies?",
          when: () => !opts.packageManager,
          default: opts.packageManager || "npm",
          choices: [
            "npm",
            "yarn",
            { name: "Skip installing dependencies", value: "skip" },
          ],
        },
      ]);

      const fullPath = getFullPath(root, projectDir);

      console.log(
        `🏗️A new Curator project will be created at ${chalk.blue(fullPath)}`
      );

      if (await pathIsNotEmpty(fullPath)) {
        console.error(
          chalk.red(
            "❌  The chosen directory already exists and contains files."
          )
        );
        process.exit(1);
      }

      // await createProject(root, dir);

      console.log(chalk.green("✅  Curator project has been created."));

      if (pkgManager === "skip") {
        console.log("☝️ Don't forget to manually install the dependencies.");
      } else {
        const spinner = ora(
          chalk.blueBright(
            "Installing dependencies with " + chalk.bold(pkgManager) + "..."
          )
        ).start();
        if (components.includes("admin")) {
          shell.cd(`${dir}/admin`);
          shell.exec(`${pkgManager} install`);
        }
        if (components.includes("platform")) {
          shell.cd(`../platform`);
          shell.exec(`${pkgManager} install`);
        }
        if (components.includes("web")) {
          shell.cd(`../web`);
          shell.exec(`${pkgManager} install`);
        }
        shell.cd(`..`);
        spinner.stop();
      }
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
