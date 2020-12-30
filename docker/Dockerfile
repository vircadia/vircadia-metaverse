# Dockerfile for building a runable version of the Iamus metaverse-server
FROM node:14 as iamus-build

ARG BRANCH=master

RUN mkdir -p /usr/local/src \
    && cd /usr/local/src \
    && git clone --depth 1 --branch ${BRANCH} https://github.com/vircadia/Iamus.git

RUN cd /usr/local/src/Iamus \
    && npm install

# Build the application into the 'dist' directory
RUN cd /usr/local/src/Iamus \
    && npm run build

# ==================================================
# FROM node:14-slim as iamus-run    # 'slim' works so consider using it after debugging
FROM node:14 as iamus-run

ENV USER=cadia

# Add a user for the server to run under
RUN adduser --disabled-password --gecos 'metaverse-server user' ${USER}

WORKDIR /home/${USER}
USER ${USER}:${USER}

RUN mkdir -p /home/${USER}/Iamus/dist \
    mkdir -p /home/${USER}/config

# Copy over the built files
COPY --from=iamus-build --chown=${USER}:${USER} /usr/local/src/Iamus/package*.json /home/${USER}/Iamus/
COPY --from=iamus-build --chown=${USER}:${USER} /usr/local/src/Iamus/dist /home/${USER}/Iamus/dist

# Install the production NPM packages
RUN cd /home/${USER}/Iamus \
    && npm install --production

# The startup scripts
COPY --chown=${USER}:${USER} ./files/run-iamus.sh /home/${USER}
COPY --chown=${USER}:${USER} ./files/GetVersion.sh /home/${USER}

# directory created so caller can mount and use a config file from here
VOLUME /home/${USER}/config

EXPOSE 9400

ENTRYPOINT [ "/home/cadia/run-iamus.sh" ]
