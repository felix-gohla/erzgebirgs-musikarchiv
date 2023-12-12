#############################
# Build container
FROM node:20-alpine as build

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
COPY . /app
RUN yarn build

#############################
# Server container
FROM alpine:3.17

# Install nginx & configure.
RUN apk --update --no-cache add \
    nginx \
    && true
RUN rm /etc/nginx/http.d/default.conf
COPY docker/nginx.conf /etc/nginx/http.d

# Copy build artefacts.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
