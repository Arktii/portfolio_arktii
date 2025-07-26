// import adapter from '@sveltejs/adapter-static';
import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		// adapter: adapter({
		// 	fallback: '404.html'
		// }),
		// paths: {
		// 	base: process.argv.includes('dev') ? '' : '/portfolio_arktii'
		// }
		adapter: vercel(),
		paths: {
			base: ''
		}
	}
};

export default config;
