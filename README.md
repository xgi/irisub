# Collaborative Subtitle Editor

Irisub is a modern subtitle editor with real-time collaboration. Create and edit
subtitles for videos from YouTube, Vimeo, or your own device, and share
your projects with others to make edits together in real-time.

Try it out: [irisub.com](https://irisub.com)

---

## Development

Prerequisites:

- [Node](https://nodejs.org) >= 18
- [pnpm](https://pnpm.io)
- [Docker](https://www.docker.com)

```bash
# Install package dependencies
pnpm install

# Start database and Firebase emulator containers
docker-compose up --build --detach

# Perform initial database migrations
pnpm exec nx run gateway:migrate-db

# Start API and web app servers
pnpm exec nx run-many --target=serve

```

This is an Nx monorepo, and Nx is used for all lint/build/serve tasks. You can
run them using the CLI commands (such as the ones above), but I recommend
using the VSCode extension: https://nx.dev/core-features/integrate-with-editors.

The serve command supports hot reloading on code changes for both the API
server and web app.

## Stack

This project consists of 2 major components (plus a Postgres DB).

- web
  - React web application
  - Compiled and deployed statically with Vite
- gateway
  - Express.js API server
  - Kysely is used for Postgres queries and migrations
  - Built and deployed as [irisub-gateway](https://github.com/xgi/irisub/pkgs/container/irisub-gateway) Docker image

Firebase is used for authentication. A Docker container running the Firebase
emulator is available for development.

## Credits

- Much of the UI for Irisub is adapted from Hoppscotch --
  https://github.com/hoppscotch/hoppscotch (MIT).

## License

[MIT License](https://github.com/xgi/irisub/blob/main/LICENSE.txt)
