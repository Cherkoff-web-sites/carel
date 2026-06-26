#!/bin/sh
set -e

UPLOADS_ROOT="${UPLOADS_DIR:-public/uploads}"
mkdir -p "$UPLOADS_ROOT/images" "$UPLOADS_ROOT/docs"

exec node server.js
