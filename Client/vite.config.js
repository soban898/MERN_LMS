import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"; 
import { dirname } from "path";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

fs.readFile(_filename,(err,data)=>{
  console.log('data', data.toString())
})

import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(_dirname, "./src"),
    },
  },
})

