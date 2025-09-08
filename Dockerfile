FROM oven/bun:1.1.21-debian
ENV DEBIAN_FRONTEND noninteractive
WORKDIR /usr/src/api
RUN apt-get update -yq \
    && apt-get install -y --no-install-recommends build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY ./ ./

CMD ["bun","run","start"]
