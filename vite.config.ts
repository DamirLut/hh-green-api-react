import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
	base: "/hh-green-api-react/",
	plugins: [react(), babel({ presets: [reactCompilerPreset()] }), svgr()],
	resolve: {
		tsconfigPaths: true,
	},
});
