echo "==== fetching latest docker image for metaverseserver"
docker pull ghcr.io/vircadia/iamus:latest
echo "==== stopping metaverseserver"
docker stop metaverseserver
echo "==== removing old metaverseserver image"
docker rm metaverseserver
echo "==== starting metaverseserver"
./run-metaverse-server.sh

