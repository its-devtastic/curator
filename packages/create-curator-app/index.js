#!/usr/bin/env node
/**
 * Copyright (c) 2023-present, Devtastic.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { init } from "./createCuratorApp.js";

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split(".");
const major = semver[0];
const REQUIRED_VERSION = 18;

if (major < REQUIRED_VERSION) {
  console.error(
    "You are running Node " +
      currentNodeVersion +
      ".\n" +
      `Create Curator App requires Node ${REQUIRED_VERSION} or higher. 
` +
      "Please update your version of Node."
  );
  process.exit(1);
}

init();
