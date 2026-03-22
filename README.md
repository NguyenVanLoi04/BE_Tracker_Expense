<<<<<<< HEAD

### Migration:

1. Create empty migration: `npm run migration:create --name='name'`
2. Generate migration base on differences with database: `npm run migration:generate --name='name'`
3. Run migration: `npm run migration:up`
4. Revert migration: `npm run migration:down`

### Husky:

1. Skip husky with command: git commit -n -m '<commit message>'

### Docker: run docker

docker run -d -p 3000:5005 --name be-tracker-expense --env-file .env be-tracker-expense
