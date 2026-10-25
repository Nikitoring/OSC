# Database

OSC uses PostgreSQL with PostGIS.

## Initial setup

`database/init.sql` is mounted into the PostgreSQL initialization
directory. PostgreSQL executes initialization scripts only when the
database data directory is initialized for the first time.

For an existing database, changing `init.sql` does not apply schema
changes automatically.

## Existing database migration

1. Create a backup of the database.
2. Run the migration from the project root:

   ```bash
   docker compose exec -T postgres \
     psql -U openstreet-cat -d openstreet-cat \
     -v ON_ERROR_STOP=1 \
     < database/migrations/001_align_schema.sql
   ```

3. Check the tables:

   ```bash
   docker compose exec postgres \
     psql -U openstreet-cat -d openstreet-cat -c '\dt'
   ```

Do not delete `database/data` to apply a migration.
Removing the data directory can permanently delete the local database.

## Tables

- `users`: user accounts and password hashes.
- `cats`: cats and their PostGIS locations.
- `cat_photos`: cat photo URLs.
- `help_requests`: food, medical, and home help events.

The schema defines the database structure. It does not automatically
implement API endpoints for photos or help requests.
