#!/bin/sh
service cron start

base_env=.env
docker_env=.env.docker.local
unused_env=.env.unused

# edited state, revert to working state
# if [[ -f $base_env && -f $unused_env ]]; then
#     echo "file $base_env and $unused_env exists"
#     mv .env .env.docker.local
#     mv .env.unused .env
# fi

# base to working state
if [ -f $base_env ]; then
    if [ -f $docker_env ]; then
        echo "file $base_env and $docker_env exists"
        mv .env .env.unused
        mv .env.docker.local .env
    fi
fi

# exec CMD commands
exec "$@"