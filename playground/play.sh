#!/usr/bin/env bash

set -e;

OLD_PWD=$(pwd);
EXAMPLE=$1;

if [ -z $EXAMPLE ]; then
    EXAMPLES=$(find playground -mindepth 1 -maxdepth 1 -type d -exec basename {} \;);
else
    EXAMPLES=("$EXAMPLE");
fi;

for EXAMPLE in ${EXAMPLES[@]}; do
    echo "Playing with $EXAMPLE";

    DIR="$OLD_PWD/playground/$EXAMPLE";

    if [[ -d "$DIR" ]]; then
        cd "$DIR";
        [[ -d "./node_modules" ]] || npm ci;
        npm run build;
    fi;
done

cd "$OLD_PWD";

set +e;
