FROM node:18-slim

RUN mkdir /app
WORKDIR /app
COPY . .
RUN yarn && yarn build

EXPOSE 3000
CMD yarn start