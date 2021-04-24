#! /bin/bash
# Start the metaverseserver with persistant data in local dir

BASE=$(pwd)
cd "${BASE}"

DVERSION=latest

docker run -d \
    --name=metaverseserver \
    --restart=unless-stopped \
    -p 9400:9400 \
    -e IAMUS_CONFIG_FILE=/home/cadia/config/iamus.json \
    --network="host" \
    --volume ${BASE}/config:/home/cadia/config \
    ghcr.io/vircadia/iamus:${DVERSION}
