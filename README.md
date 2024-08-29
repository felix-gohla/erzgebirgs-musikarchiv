# Frontend erzgebirgs-musik-archiv

This is the web frontend for the project "erzgebirgs-musik-archiv".
It displays songs, authors and other information provided by the authors via
a [Directus](https://directus.io) backend.

## Development

The following guide helps to setup the web frontend and the backend.
Please **make sure to copy** [`example.env`](./example.env) and modify it to your needs.

### Backend setup

A development version of the backend version can be started using `docker compose up -d`.
See the [compose file](./compose.yml) for configuration options.

### Frontend Setup

The frontend is written with [React](https://react.dev), the used package manager is [https://yarnpkg.com](yarn).  

1. For development, you need to enable at least yarn 4: `corepack enable`.
1. Then, install all the dependencies: `yarn install`.
1. Having done that, you can start a development server with `yarn dev`.

*Alternatively*, use the [docker compose](./compose.yml) file to start a frontend.

## Distribution

The application can be built using `yarn build`. The resulting files are in the `dist` directory and can be served with any webserver.

Alternatively, a container image can be built e.g. using [Docker](https://www.docker.com): `docker build -t erzgebirgs-musik-archiv --build-arg BACKEND_BASE=https://<your directus API domain> --build-arg FRONTEND_BASE=https://<your frontend domain> .`.
The reverse proxy within the container uses port `80`.

## Directus Schema

The schema of the database is available in [schema-backup.json](schema-backup.json). In order to upgrade the schema in production, you have to do the following:

1. Create an access token for the source directus instance.
1. Create an access token for the target directus instance.
1. Run `bash ./scripts/schema-management.sh` and follow the instructions in the script.
