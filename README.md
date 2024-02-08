# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

Install dependencies:

```sh
yarn
```

Install SQLite

Ubuntu

```sh
sudo apt update
sudo apt install sqlite3
```

```sh
yarn setup
```

Migrating Prisma to new schema

```sh
prisma migrate dev --name <enter name for migration>
```


From your terminal:

```sh
yarn dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
yarn run build
```

Then run the app in production mode:

```sh
yarn start
```

