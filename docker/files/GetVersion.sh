#! /bin/bash
# Print out the version information for this built instance.
# This looks for teh version file in several directories and, when found,
#     extracts one line from the JSON file.

KEY="version-tag"
if [[ ! -z "$1" ]] ; then
    KEY=$1
fi

for file in "./VERSION.json" "./dist/VERSION.json" "./Iamus/VERSION.json" "./Iamus/dist/VERSION.json" ; do
    if [[ -e "${file}" ]] ; then
        grep "${KEY}" "${file}" | sed -e 's/^.*".*": *"\(.*\)".*$/\1/'
        exit
    fi
done
# if file wasn't found, just output 'unknown'
echo "unknown"



