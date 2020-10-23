#! /bin/bash
# Generate changelog for Iamus

CHANGELOG=ChangeLog.md

cat > "${CHANGELOG}" << EOFFFF
# Iamus Changelog
EOFFFF

for majorver in "2.2" ; do
    for ver in $(seq 17 -1 10) ; do
        echo "## Version ${majorver}.${ver}" >> "${CHANGELOG}"
        echo "<ul>" >> "${CHANGELOG}"
    
        lastver=$((ver - 1))
        echo "ver=$ver, lastver=$lastver"
        git log ${majorver}.${lastver}..${majorver}.${ver} \
            --pretty=format:'<li><a href="http://github.com/kasenvr/Iamus/commit/%H">view &bull;</a> %s</li> ' \
            --reverse | grep -v Merge >> "${CHANGELOG}"

        echo "</ul>" >> "${CHANGELOG}"
    done
done

