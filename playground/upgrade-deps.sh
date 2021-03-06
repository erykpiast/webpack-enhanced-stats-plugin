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
    if [[ "$EXAMPLE" == "create-react-app" ]]; then
        continue;
    fi

    echo "Updating $EXAMPLE";

    DIR="$OLD_PWD/playground/$EXAMPLE";

    if [[ -d "$DIR" ]]; then
        cd "$DIR";
        ncu -u -t minor -f webpack,webpack-cli,terser-webpack-plugin;
        ncu -u -t newest -x webpack,webpack-cli,terser-webpack-plugin;
        npm i;
        npm audit fix;
    fi;
done;

cd "$OLD_PWD";

set +e;