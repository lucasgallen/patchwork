#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /usr/src/app/tmp/pids/server.pid

# Make data directories
mkdir -p ./data/nginx/conf.d

# Move nginx app config file
cp app.conf ./data/nginx/conf.d/

# Install missing gems
bundle check || bundle install

# Install missing node modules
yarn install --frozen-lockfile --check-files
yarn cache clean

if psql -lqt --host=db --username=$DATABASE_USERNAME | cut -d \| -f 1 | grep -qw $DATABASE_NAME; then
    # db exists; run migrations
    # $? is 0
    bin/rails db:migrate
else
    # db does not exist; setup db
    # $? is 1
    bin/rails db:setup
    bin/rails db:migrate
fi

bin/rails s -e $RAILS_ENV -p $RAILS_PORT

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
