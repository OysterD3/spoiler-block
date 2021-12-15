import type { Plugin } from "vite";
import { copyFile } from "fs/promises";
import { dirname, join, resolve } from "path";

export default (): Plugin => {
  return {
    name: "copy-manifest",
    apply: "build",
    buildEnd: async () => {
      await copyFile(
        join(resolve(dirname("")), "manifest.json"),
        join(resolve(dirname("")), "dist", "manifest.json"),
      );
    },
  };
};
