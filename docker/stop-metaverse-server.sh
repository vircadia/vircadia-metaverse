#! /bin/bash
# Stops the metaverse server and cleans up

echo "==== stopping metaverse-server"
docker stop metaverseserver
echo "==== removing old metaverse-server image"
docker rm metaverseserver
