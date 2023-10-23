FROM node:21.0.0-alpine3.18 AS build

WORKDIR /app
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json
RUN apk update 

RUN apk add --no-cache git
RUN npm i --quiet

ADD . /app
RUN npm run build

# Multistage docker
FROM node:21.0.0-alpine3.18
RUN apk --no-cache upgrade

COPY --from=build /app /app
WORKDIR /app
EXPOSE 3000
CMD ["npm","run","start:prod"]