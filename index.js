import config from "./oxlintrc.json" with { type: "json" };

/**
 * The same configuration `oxlintrc.json` holds, re-exported for
 * `oxlint.config.ts` consumers.
 *
 * @see https://oxc.rs/docs/guide/usage/linter/config
 * @type {import("oxlint").OxlintConfig}
 */
export default config;
