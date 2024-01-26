FROM ubuntu:latest
ENV DEBIAN_FRONTEND noninteractive
WORKDIR /usr/src/api
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_18.x | bash \
    && apt-get install nodejs -yq

RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

COPY ./ ./
RUN npm install

CMD ["npm","run","start"]
