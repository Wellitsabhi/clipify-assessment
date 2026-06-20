import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    // Recipe/chat imagery includes runtime-generated local files (/generated/*)
    // and remote-origin URLs; plain <img> is intentional here.
    files: ["app/(app)/**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  {
    // Fetch-on-mount is idiomatic here: state is set inside async callbacks,
    // not synchronously in the effect body. Keep as a warning rather than a
    // hard error so legitimate data loading doesn't fail the build.
    files: ["app/**/*.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
