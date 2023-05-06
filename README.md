# Daily Game Trivia

The **Daily Game Trivia** is an open-source and public browser game where you have to find out the secret game based on hints such as year of release, genre, player's perspective and more. Inspired by [gamedle.wtf](https://gamedle.wtf).

Game information is provided by [Twitch's IGDB](https://www.igdb.com).

## Development

The **Daily Game Trivia** is a React application built using [Parcel](https://parceljs.org/).

To start clone the repository and run:

```sh
npm start
```

This will install dependencies, copy the `pre-commit` hook and spin up a development server.

### Static analysis

We use ESLint, Prettier and TypeScript to maintain code quality.

```sh
npm run format -- --write
npm run lint -- --fix
```

### Deployment

Build the production bundle by running:

```sh
npm run build
```

## License

Apache-2.0 © Arthur Corenzan and collaborators.
