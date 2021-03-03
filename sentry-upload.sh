#!/bin/sh

sentry-cli releases new "$SENTRY_RELEASE"
sentry-cli releases files "$SENTRY_RELEASE" upload-sourcemaps ./dist
sentry-cli releases finalize "$SENTRY_RELEASE"
