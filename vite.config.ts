import path from "path"
import mdx from "@mdx-js/rollup"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      routesDirectory: "./src/app/routes",
      generatedRouteTree: "./src/app/routeTree.gen.ts",
      autoCodeSplitting: true,
    }),
    { enforce: "pre", ...mdx({ remarkPlugins: [remarkGfm, remarkMath], rehypePlugins: [rehypeKatex] }) },
    react({
      include: /\.(mdx|js|jsx|ts|tsx)$/,
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@hyper/shadcn": path.resolve(__dirname, "./src"),
      "@hyper/dice-ui": path.resolve(__dirname, "./src/components/dice"),
      "@hyper/data-table-filters": path.resolve(__dirname, "./src/components/data-table-filters"),
      "@hyper/evilcharts": path.resolve(__dirname, "./src/components/evilcharts"),
      "@hyper/gooseui": path.resolve(__dirname, "./src/components/gooseui"),
      "@hyper/limeplay": path.resolve(__dirname, "./src/components/limeplay"),
      "@hyper/manifest-ui": path.resolve(__dirname, "./src/components/manifest"),
      "@hyper/extend-ui": path.resolve(__dirname, "./src/components/extend"),
      "@hyper/chamaac-ui": path.resolve(__dirname, "./src/components/chamaac"),
      "@hyper/sabraman": path.resolve(__dirname, "./src/components/sabraman"),
      "@hyper/uselayouts": path.resolve(__dirname, "./src/components/uselayouts"),
      "@hyper/patterns": path.resolve(__dirname, "./src/components/patterns"),
      "@hyper/plate": path.resolve(__dirname, "./src/components/plate"),
      "@hyper/tool-ui": path.resolve(__dirname, "./src/components/tool"),
    },
  },
})
