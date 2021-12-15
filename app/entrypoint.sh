#!/bin/sh

# this script is used to wait for postgres before applying migrations
# and starting Django

$DATABASE="postgres"
$SQL_HOST="db"
$SQL_PORT="5432"

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# when the database is ready we can run the migrations and collect static files
python3 manage.py flush --no-input
python3 manage.py migrate
python3 manage.py collectstatic --no-input --clear

python3 manage.py test

exec "$@"