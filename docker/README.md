## Docker for Iamus Metaverse Server

The files here are for creating and running Iamus under Docker.

The `Dockerfile` is used to build the image with the `files` directory
holding the scripts that are copied into the image for its operation.
See the build action in `.github/workflows/docker-publish.yml` to see
the steps for building.

The other script files here are for starting, running, restarting, and
updating a running Iamus metaverse-server. 
The naming pretty obvious.

To run Iamus with Docker,
read the information in `docs/RunningDockerImage.md`
for setup of the configuration files and MongoDB.
Then, on the server that has Docker and MongoDB installed,
clone the Iamus repository
and, from the directory with the created `config` directory,
execute `run-metaverse-server.sh` to start the server.
