# This file is generated by Nx.
#
# Build the docker image with `npx nx docker-build gateway`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -p 3123:3123 -t gateway`.
FROM docker.io/node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3123

WORKDIR /app

RUN addgroup --system gateway && \
  adduser --system -G gateway gateway

COPY dist/apps/gateway gateway
RUN chown -R gateway:gateway .

CMD [ "node", "gateway" ]
