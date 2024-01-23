ARG BACKEND_BASE=https://api.musikdb.felixgohla.de

#############################
# Dev container
FROM node:20-alpine as dev

# Enable updates for yarn
RUN corepack enable

# Only copy package information for caching.
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
COPY .yarnrc.yml /app
# Install packages.
RUN yarn install --immutable

# Copy the rest and build the app.
COPY index.html tsconfig.json tsconfig.node.json vite.config.ts /app/
COPY public /app/public/
COPY src /app/src/

#############################
# Build container
FROM dev AS build
ARG BACKEND_BASE

ENV VITE_CMS_API_URL=${BACKEND_BASE}

RUN yarn build

#############################
# Server container
FROM alpine:3.17

# Install nginx & configure.
RUN apk --update --no-cache add \
    curl \
    nginx \
    && true
RUN rm /etc/nginx/http.d/default.conf
COPY docker/nginx.conf /etc/nginx/http.d

# Copy build artefacts.
COPY --from=build --chown=www-data:www-data /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
