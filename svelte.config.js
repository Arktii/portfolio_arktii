import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: '200.html'
		})
	},
	paths: {
		base: process.env.NODE_ENV === 'production' ? '/portfolio_arktii' : ''
	}
};

export default config;
