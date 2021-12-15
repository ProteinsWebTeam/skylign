# Skylign web app

This is a python port of the perl [Skylign LogoServer](https://github.com/ProteinsWebTeam/LogoServer); the main change in the repository has been replacing the perl Catalyst web framework with Django, encapsulating the whole stack in a Docker image. The perl repositories are shipped with the repo rather than being pulled, as there are no planned updates other than porting them to Python. The repository should be updated as more HmmerWeb functions get ported to Python, eventually dropping the Perl dependencies altogether.

To get a local instance running on `localhost` follow the instructions on the Docker Setup section down below.

## App Overview

All Django functions are implemented in `app/logo/`. The Perl code which is still used to generate the logo is stored in the `repositories` folder. The `nginx` folder is used only for testing the full server environment in Docker. All relevant files for operating in the staging and live environments are found in `app` - which contains the Django application - and `configs`. We use MySQL instead of SQLite only because the Hinxton web VMs do not support the minimum SQLite version required by Django (if this changes in the future, it would be good to refactor the system, removing the dependency on the external MySQL database).

## Perl Functions

We use some intermediary functions defined in `perl_functions/perl_functions.pm` to load the perl modules in `repositories`; these in turn are called using the definitions in `perl_functions/perl_functions.py` with the help of `perl_functions/perlfunc.py`.

## Docker Setup

We opted to use Postgres as SQL database in Docker for ease of setup. There are two docker-compose files: one implements a simple Django local server, whereas the other (`docker-compose-prod.yml`) simulates a complete backend.

To run locally with Docker enter with the terminal in the repository folder and run the following commands

```bash
# take down any previous instances, including their volumes
docker-compose down -v

# build containers and spin the Django app on localhost:8000
docker-compose -f docker-compose.yml up -d --build
```

The app should now be available at `localhost:8000`. Django migrations and static files collections are executed in `app/entrypoint.sh`, which is also used to wait for the SQL server to be fully operational before starting the Django app.

## Running in the Cluster

All the relevant documentation to run the Skylign Web Server in the EBI web VMs can be found in the [Skylign Django Confluence page](https://www.ebi.ac.uk/seqdb/confluence/display/PF/Skylign+with+Django+setup).