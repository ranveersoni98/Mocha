# Docker Install

## Requirements

- Docker 24+
- Docker Compose v2

## Quick Start

Create a `docker-compose.yml` file with the following content:

```yaml
version: "3.1"

services:
  mocha_postgres:
    container_name: mocha_postgres
    image: postgres:16
    restart: always
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: mocha
      POSTGRES_PASSWORD: changeme
      POSTGRES_DB: mocha

  mocha:
    container_name: mocha
    image: emberlyoss/mocha:latest
    ports:
      - 3000:3000
      - 5003:5003
    restart: always
    depends_on:
      - mocha_postgres
    environment:
      DB_USERNAME: "mocha"
      DB_PASSWORD: "changeme"
      DB_HOST: "mocha_postgres"
      SECRET: 'a-long-random-secret'

volumes:
  pgdata:
```

Start the stack:

```bash
docker compose up -d
```

Mocha is now running at **http://your-server-ip:3000**

## Default Credentials

```
Email:    admin@admin.com
Password: 1234
```

> **Important:** Change the default password immediately after first login.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DB_USERNAME` | PostgreSQL username | `mocha` |
| `DB_PASSWORD` | PostgreSQL password | — |
| `DB_HOST` | PostgreSQL host | `mocha_postgres` |
| `SECRET` | JWT signing secret (use a long random string) | — |
| `PORT` | Client port | `3000` |
| `API_PORT` | API port | `5003` |

## Updating

```bash
docker compose pull
docker compose up -d
```
