# @mylesb/oxlint-config

> myles' shared [oxlint](https://oxc.rs) configuration for (hopefully) all his projects.

A single source of truth for linting, so every project catches the same mistakes without copy-pasting rules around.

Pairs with [`@mylesb/prettier-config`](https://github.com/myles/prettier-config) — oxlint handles correctness, Prettier handles formatting.

## Settings

Categories:

| Category      | Level   | Meaning                                       |
| ------------- | ------- | --------------------------------------------- |
| `correctness` | `error` | Code that is outright wrong or useless.       |
| `suspicious`  | `error` | Code that is most likely wrong or useless.    |
| `perf`        | `warn`  | Code that could be written more performantly. |

`pedantic`, `restriction`, `style`, and `nursery` stay off — opt into them per project when you want the noise.

Plugins: `eslint`, `import`, `node`, `oxc`, `promise`, `typescript`, `unicorn`.

Rules on top of the categories:

| Rule                           | Level   |
| ------------------------------ | ------- |
| `eqeqeq`                       | `error` |
| `no-var`                       | `error` |
| `prefer-const`                 | `error` |
| `import/no-cycle`              | `error` |
| `unicorn/prefer-node-protocol` | `error` |
| `no-console`                   | `warn`  |

Everything else falls back to [oxlint's defaults](https://oxc.rs/docs/guide/usage/linter/rules).

## Installation

```sh
npm install --save-dev @mylesb/oxlint-config oxlint
```

> Requires oxlint `>=1.0.0`.

## Usage

oxlint has no concept of ESLint-style shared configs — `extends` takes file paths, not package names. Pick whichever of the two below suits the project.

### Extend it from `.oxlintrc.json`

Point `extends` at the file inside `node_modules`:

```json
{
  "extends": ["./node_modules/@mylesb/oxlint-config/oxlintrc.json"],
  "rules": {
    "no-console": "off"
  }
}
```

Later entries win, so anything you add alongside `extends` overrides the shared config.

### Extend it from `oxlint.config.ts`

TypeScript config files get the shared config as an object:

```ts
import mylesOxlintConfig from "@mylesb/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [mylesOxlintConfig],
  rules: {
    "no-console": "off",
  },
});
```

> oxlint auto-discovers `.oxlintrc.json`, `oxlint.config.ts`, and `oxlint.config.mts` — but **not** `oxlint.config.js` or `.mjs`. Those need `oxlint -c oxlint.config.js`. TypeScript config files are experimental and only work when oxlint runs under Node.js.

## Linting

Once configured, run oxlint as usual:

```sh
# Report problems
npx oxlint

# Fix what can be fixed
npx oxlint --fix
```

## License

[MIT](./LICENSE) © [myles braithwaite](https://myles.garden)
