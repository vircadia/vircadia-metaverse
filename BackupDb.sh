#! /bin/bash
# Script to backup the Iamus MongoDb database.
# The script reads the Iamus configuration file for parameters and
#    writes an MongoDb archive file to the specified directory.
#
# This reads the Iamus configuration file (default "./iamus.json" to
#   get the name and location of the database as well as the account
#   to use to do the backup. This expects the following in the config file:
# {
#     "database": {
#         "db": "databaseName",
#         "db-host": "databaseHostname"
#     },
#     "backup": {
#         "backup-user": "backupUsername",
#         "backup-pw": "backupUserPassword",
#         "backup-dir": "directoryName"               (optional. defaults to "./DatabaseBackup")
#         "authenticationDatabase": "databaseName"    (optional. defaults to "admin")
#     }
# }
#
# This scripts expects the following packages to be installed on Linux:
#       jq -- JSON parsing

CONFIG_FILE="iamus.json"
ARCHIVE_DIR="./DatabaseBackup"

while getopts "hc:d:" opt; do
    case "$opt" in
        (h)
            show help
            ;;
        (c)
            CONFIG_FILE=$OPTARG
            ;;
        (d)
            ARCHIVE_DIR=$OPTARG
            ;;
    esac
done

if [[ ! -e "$CONFIG_FILE" ]] ; then
    echo "Configuration file $CONFIG_FILE does not exist"
    exit 1
fi

mkdir -p "$ARCHIVE_DIR"

# Parameters from config file
DB_NAME=$(jq '.database["db"]' "$CONFIG_FILE" | sed -e 's/"//g' )
DB_HOST=$(jq '.database["db-host"]' "$CONFIG_FILE" | sed -e 's/"//g' )

BACKUP_USER=$(jq '.backup["backup-user"]' "$CONFIG_FILE" | sed -e 's/"//g' )
BACKUP_USER_PW=$(jq '.backup["backup-pw"]' "$CONFIG_FILE" | sed -e 's/"//g' )

# Make sure we got all the parameters
if [[ -z "${DB_NAME}" || "${DB_NAME}" == "null" ]] ; then
    echo "Database name not found in config file ${CONFIG_FILE}:database.db"
    exit 1
fi
if [[ -z "${DB_HOST}" || "${DB_HOST}" == "null" ]] ; then
    echo "Database host not found in config file ${CONFIG_FILE}:database.db-host"
    exit 1
fi
if [[ -z "${BACKUP_USER}" || "${BACKUP_USER}" == "null" ]] ; then
    echo "Backup user not found in config file ${CONFIG_FILE}:backup.backup-user"
    exit 1
fi
if [[ -z "${BACKUP_USER_PW}" || "${BACKUP_USER_PW}" == "null" ]] ; then
    echo "Backup user password not found in config file ${CONFIG_FILE}:backup.backup-pw"
    exit 1
fi

# Archive directory can be specified in the backup directory
CONFIG_ARCHIVE_DIR=$(jq '.backup["backup-dir"]' "$CONFIG_FILE" | sed -e 's/"//g' )
if [[ ! -z "$CONFIG_ARCHIVE_DIR" && "$CONFIG_ARCHIVE_DIR" != "null" ]] ; then
    ARCHIVE_DIR="$CONFIG_ARCHIVE_DIR"
fi

# The MongoDB account authorizationDatabase is usually "admin" but it can change
AUTH_DB="admin"
CONFIG_AUTH_DB=$(jq '.backup["authenticationDatabase"]' "$CONFIG_FILE")
if [[ ! -z "$CONFIG_AUTH_DB" && "$CONFIG_AUTH_DB" != "null" ]] ; then
    AUTH_DB="$CONFIG_AUTH_DB"
fi

DATETAG=$(date +%Y%m%d.%H%M)
ARCHIVE_FILE="${ARCHIVE_DIR}/Backup-${DB_NAME}-${DATETAG}"

echo "Backing up database ${DB_NAME} on host ${DB_HOST} with user ${BACKUP_USER} to file ${ARCHIVE_FILE}"

mongodump --username="$BACKUP_USER" --password="${BACKUP_USER_PW}" --authenticationDatabase="$AUTH_DB" \
        --host="${DB_HOST}" --db="${DB_NAME}" --gzip --archive="${ARCHIVE_FILE}"

ls -l "${ARCHIVE_FILE}"
        

