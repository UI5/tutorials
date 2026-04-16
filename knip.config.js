const config = {
	/**
	 * We only need dependency checking at the moment,
	 * so all checks except for dependencies are turned off.
	 */
	rules: {
		files: "off",
		duplicates: "off",
		unlisted: "off",
		binaries: "off",
		unresolved: "off",
		catalog: "off",
		exports: "off",
		types: "off",
		enumMembers: "off",
	},

	ignoreDependencies: [
		/**
		 * Used inside the tutorial steps and required for UI5 CLI setup
		 */
		"ui5-middleware-livereload",
		"ui5-middleware-serveframework",
		"ui5-middleware-simpleproxy",
		"ui5-tooling-transpile",
		"@types/openui5",
		"@ui5/ts-interface-generator",

		/**
		 * Used for the local developmet setup (see tools/dev-server/ghpage-template.hbs)
		 */
		"@highlightjs/cdn-assets",
		"anchor-js",
		"github-markdown-css",
	],
};

export default config;
