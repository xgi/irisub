FROM node:bullseye

WORKDIR /app

ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PATH:$PNPM_HOME

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY out .
RUN pnpm i

RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
RUN mkdir /data
RUN chown expressjs:expressjs /data
USER expressjs

# CMD node packages/irisub-gateway/dist/app.js


CMD sleep 9999999999999