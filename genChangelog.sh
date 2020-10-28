#! /bin/bash
# Generate changelog for Iamus.
# Lists Git log messages that were committed for each release.
# Expects the Git tree to be tagged with the version numbers.

# Initial version that is hardwired with version numbers.

CHANGELOG=ChangeLog.md

cat > "${CHANGELOG}" << EOFFFF
# Iamus Changelog
EOFFFF

for majorver in "2.2" ; do
    for ver in $(seq 20 -1 10) ; do
        echo "## Version ${majorver}.${ver}" >> "${CHANGELOG}"
        echo "" >> "${CHANGELOG}"
        echo "<ul>" >> "${CHANGELOG}"
    
        lastver=$((ver - 1))
        git log ${majorver}.${lastver}..${majorver}.${ver} \
            --pretty=format:'<li><a href="http://github.com/kasenvr/Iamus/commit/%H">view &bull;</a> %s</li> ' \
            --reverse | grep -v Merge >> "${CHANGELOG}"

        echo "</ul>" >> "${CHANGELOG}"
        echo "" >> "${CHANGELOG}"
    done
done

