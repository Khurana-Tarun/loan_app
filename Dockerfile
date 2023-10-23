FROM node:16.3.0-alpine AS build

WORKDIR /app
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json
RUN apk update 

RUN apk add --no-cache git
RUN npm i --quiet

ADD . /app
RUN npm run build

# Multistage docker
FROM node:16.3.0-alpine
RUN apk --no-cache upgrade

COPY --from=build /app /app
WORKDIR /app
EXPOSE 3000
CMD ["npm","run","start:prod"]