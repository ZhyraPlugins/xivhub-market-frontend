//import adapter from '@sveltejs/adapter-node';
// import preprocess from 'svelte-preprocess';
import adapter from 'svelte-adapter-deno';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	// preprocess: preprocess(),
	preprocess: [vitePreprocess()],

	kit: {
		adapter: adapter()
	},
};

export default config;
