#!/bin/sh
set -e

mkdir -p /app/data

if [ ! -f /app/data/catalog.json ] && [ -f /app/data-default/catalog.json ]; then
  cp /app/data-default/catalog.json /app/data/catalog.json
fi

exec node server.js
