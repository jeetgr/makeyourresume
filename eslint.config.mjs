import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "__temp__/**",
      "next-env.d.ts",
    ],
  },
  ...fixupConfigRules(compat.extends("next/core-web-vitals")),
];

export default eslintConfig;
