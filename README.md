### Migration:

1. Create empty migration: `npm run migration:create --name='name'`
2. Generate migration base on differences with database: `npm run migration:generate --name='name'`
3. Run migration: `npm run migration:up`
4. Revert migration: `npm run migration:down`

### Husky:

1. Skip husky with command: git commit -n -m '<commit message>'

### Cron Job:

1. Sync UrBox: `npm run cron-job sync-product-ur-box`

### Run redis:

1. docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
