import { fileURLToPath } from "node:url"
import path from "node:path"
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": rootDir,
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    pool: "forks",
    fileParallelism: false,
  },
})
