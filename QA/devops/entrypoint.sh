#!/bin/sh

# Start cron services
service cron start

# Exec CMD commands
exec "$@"