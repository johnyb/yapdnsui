#!/bin/bash
LANG=C #needed for perl locale

set -eu

case "$1" in
    "nodemon")
        nodemon /app/yapdnsui/bin/www
        ;;
    "start")
        node /app/yapdnsui/bin/www
        ;;
    *)
        exec "$@"
        ;;
esac
