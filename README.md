# portfolio

## Developing

To run the app, first ensure dependencies are installed

```bash
npm i
```

Then run the following command

```bash
npm run dev

# or to expose on the network:
npm run dev -- --host
```

## Building

To create a production version of the app:

```bash
npm run build
```

Preview the production build with `npm run preview`.

## Deploying

The app now deploys to Vercel automatically on pushes to the main branch.

Originally, to deploy to github pages, the following command was run from the main branch:

```bash
npm run deploy
```