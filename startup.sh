#!/bin/bash
LANG=C #needed for perl locale

set -eu

case "$1" in
    "nodemon")
        yarn dev
        ;;
    "start")
        yarn start
        ;;
    *)
        exec "$@"
        ;;
esac
