import { defineConfig } from "oxlint";

import mylesOxlintConfig from "./index.js";

export default defineConfig({
  ...mylesOxlintConfig,
  ignorePatterns: ["test/fixtures"],
});
