APP_NAME := $(shell basename $(PWD))
# ============================================
# local開発
# ============================================
dynamodb-dev: up-db
	@docker-compose run --rm --service-ports dynamodb npm run start:dev
up-db:
	@docker-compose up -d dynamodblocal
	@docker-compose up -d dynamodbadmin
ash: guard-service
	@docker-compose run --rm $(service) /bin/ash
# @docker-compose exec $(service) /bin/ash
up:
	@docker-compose up -d
down:
	@docker-compose stop
clean:
	@docker-compose down --rmi all
# ------------------------- guard -------------------------------
guard-%:
	@if [ "$($(*))" = "" ]; then \
		echo "\033[7;31menv variable $* not set; add valiable '$*=<hoge>'\033[0;39m"; \
		exit 1; \
	fi