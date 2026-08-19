import { config } from "@repo/eslint-config/react-internal";

export default [
  ...config,
  {
    ignores: [".output/**", "dist/**"],
  },
  {
    rules: {
      "turbo/no-undeclared-env-vars": [
        "warn",
        {
          allowList: ["INTERNAL_API_URL"],
        },
      ],
    },
  },
];
