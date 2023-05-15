const path = require("path");
const { program } = require("commander");
const chalk = require("chalk");
const fs = require("fs-extra");

const pkg = require("./package.json");

function init() {
  program.name(pkg.name).description(pkg.description).version(pkg.version);

  program.command("dev").action(async (dir) => {});

  program.parse(process.argv);
}

module.exports = { init };
