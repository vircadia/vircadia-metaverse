#! /bin/bash
# Generate changelog for Iamus.
# Lists Git log messages that were committed for each release.
# Expects the Git tree to be tagged with the version numbers.

# Initial version that is hardwired with version numbers.

CHANGELOG=ChangeLog.md

cat > "${CHANGELOG}" << EOFFFF
# Iamus Changelog
EOFFFF

lastver=""

for ver in $(git tag | grep '[^a-z]' | sort -t "." -k 1,1nr -k 2,2nr -k 3,3nr | head -10) ; do
    if [[ ! -z "$lastver" ]] ; then
        echo "## Version ${lastver}" >> "${CHANGELOG}"
        echo "" >> "${CHANGELOG}"
        echo "<ul>" >> "${CHANGELOG}"

        git log ${ver}..${lastver} \
            --pretty=format:'<li><a href="http://github.com/vircadia/Iamus/commit/%H">view &bull;</a> %s</li> ' \
            --reverse | grep -v Merge >> "${CHANGELOG}"

        echo "</ul>" >> "${CHANGELOG}"
        echo "" >> "${CHANGELOG}"
    fi

    lastver=${ver}
done

