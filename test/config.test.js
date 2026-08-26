import { deepStrictEqual, match, strictEqual } from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import config from "../index.js";

const PROJECT_ROOT = fileURLToPath(new URL("..", import.meta.url));
const OXLINT_BIN = fileURLToPath(
  new URL("../node_modules/.bin/oxlint", import.meta.url),
);
const CONFIG_PATH = fileURLToPath(new URL("../oxlintrc.json", import.meta.url));

const EXIT_CLEAN = 0;
const EXIT_DIAGNOSTICS = 1;

/**
 * Lints a fixture with the shared config on its own, so the tests measure
 * what consumers get rather than this repo's own `.oxlintrc.json`.
 *
 * oxlint exits non-zero when it reports an error, which `execFileSync`
 * raises as an exception — unpack it back into a plain result.
 */
function lintFixture(fixture) {
  const args = ["-c", CONFIG_PATH, `test/fixtures/${fixture}`];

  try {
    const stdout = execFileSync(OXLINT_BIN, args, {
      cwd: PROJECT_ROOT,
      encoding: "utf8",
    });

    return { code: EXIT_CLEAN, output: stdout };
  } catch (error) {
    // A null status means oxlint was killed by a signal, which is a
    // failure of the test harness rather than a lint result.
    if (error.status === null) {
      throw error;
    }

    return { code: error.status, output: `${error.stdout}${error.stderr}` };
  }
}

test("re-exports oxlintrc.json unchanged", () => {
  const json = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));

  deepStrictEqual(config, json);
});

test("oxlint accepts the config", () => {
  const printed = execFileSync(
    OXLINT_BIN,
    ["-c", CONFIG_PATH, "--print-config"],
    { cwd: PROJECT_ROOT, encoding: "utf8" },
  );

  match(printed, /"eqeqeq"/);
});

test("reports violations of the shared rules", () => {
  const { code, output } = lintFixture("violations.js");

  strictEqual(code, EXIT_DIAGNOSTICS);
  match(output, /eqeqeq/);
  match(output, /no-var/);
});

test("leaves conforming code alone", () => {
  const { code, output } = lintFixture("clean.js");

  strictEqual(code, EXIT_CLEAN, output);
});
