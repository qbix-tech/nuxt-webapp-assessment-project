/**
 * @type {import('@commitlint/types').UserConfig}
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "api",
        "build",
        "chore",
        "config",
        "ci",
        "dep",
        "docs",
        "feat",
        "fix",
        "init",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
        "ui",
      ],
    ],
  },
};
