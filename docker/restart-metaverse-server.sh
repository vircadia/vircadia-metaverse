echo "==== stopping metaverseserver"
docker stop metaverseserver
echo "==== removing old metaverseserver image"
docker rm metaverseserver
echo "==== starting metaverseserver"
./run-metaverse-server.sh

