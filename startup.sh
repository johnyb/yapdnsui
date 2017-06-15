#!/bin/sh

case "$1" in
    "nodemon")
        yarn dev
        ;;
    "start")
        NODE_ENV=production node ./bin/www
        ;;
    *)
        exec "$@"
        ;;
esac
