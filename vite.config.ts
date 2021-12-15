import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import manifest from "./plugins/manifest";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), manifest()],
});
