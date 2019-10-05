#!/usr/bin/env bash

set -e;

OLD_PWD=$(pwd);
EXAMPLE=$1;

DIR="$OLD_PWD/playground/$EXAMPLE";

if [[ -d "$DIR" ]]; then
    cd "$DIR";
    [[ -d "./node_modules" ]] || npm ci;
    npm run build;
fi;

cd "$OLD_PWD";

set +e;
