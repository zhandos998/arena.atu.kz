#!/usr/bin/env sh
set -eu

project_directory=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
backup_directory="$project_directory/backups/mysql"
timestamp=$(date +%Y%m%d_%H%M%S)
backup_file="$backup_directory/arena_$timestamp.sql.gz"

mkdir -p "$backup_directory"
cd "$project_directory"

docker compose --env-file docker.env exec -T db sh -c \
    'MYSQL_PWD="$MYSQL_PASSWORD" mysqldump --single-transaction --quick --lock-tables=false -u "$MYSQL_USER" "$MYSQL_DATABASE"' \
    | gzip > "$backup_file"

find "$backup_directory" -maxdepth 1 -type f -name 'arena_*.sql.gz' -printf '%T@ %p\n' \
    | sort -nr \
    | awk 'NR > 14 { sub(/^[^ ]+ /, ""); print }' \
    | while IFS= read -r old_backup; do
        rm -- "$old_backup"
    done

printf 'Backup created: %s\n' "$backup_file"
