#! /bin/bash
# Create a version number in a file in the distribution directory.
# The output is a JSON file with various version things in it.

VERSIONFILE="dist/VERSION.json"

PACKAGEVER="$npm_package_version"
DATE=$(date "+%Y%m%d")
GITVER=$(git rev-parse --short HEAD)
GITVERFULL=$(git rev-parse HEAD)


# Note: be sure to add the end of line commas to all but the last JSON entry

echo "{ " > "${VERSIONFILE}"
echo "  \"npm-package-version\": \"${PACKAGEVER}\"," >> "${VERSIONFILE}"
echo "  \"git-commit\": \"${GITVERFULL}\"," >> "${VERSIONFILE}"
echo "  \"version-tag\": \"${PACKAGEVER}-${DATE}-${GITVER}\"" >> "${VERSIONFILE}"
echo "} " >> "${VERSIONFILE}"
