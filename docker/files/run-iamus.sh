#! /bin/bash

BASE=/home/cadia/Iamus

# Default location for logs is in the Iamus sub-directory
LOGDIR=${BASE}/Logs
# If a log directory is provided in the mounted 'config' dir, use that one
if [[ -d "/home/cadia/config/Logs" ]] ; then
    LOGDIR=/home/cadia/config/Logs
fi
mkdir -p "${LOGDIR}"

LOGFILE=${LOGDIR}/$(date --utc "+%Y%m%d.%H%M").log

cd "${BASE}"
node dist/index.js >> ${LOGFILE} 2>&1

