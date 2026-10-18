import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/shan-shui-portfolio/",
  plugins: [react()],
});
