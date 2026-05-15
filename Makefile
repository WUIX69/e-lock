.PHONY: up down logs reset db-push db-generate db-migrate db-check db-studio validate

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

reset:
	docker compose down -v

db-push:
	pnpm db:push

db-generate:
	pnpm db:generate

db-migrate:
	pnpm db:migrate

db-check:
	pnpm db:check

db-studio:
	pnpm db:studio

validate:
	pnpm validate
