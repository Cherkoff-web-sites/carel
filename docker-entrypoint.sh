#!/bin/sh
set -e

mkdir -p public/uploads/images public/uploads/docs

exec node server.js
